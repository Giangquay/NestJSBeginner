import {
  HttpException,
  HttpStatus,
  Injectable,
  HttpExceptionBodyMessage,
  HttpExceptionBody,
} from '@nestjs/common';
import { CreatePostinfoDto } from './dto/create-postinfo.dto';
import { validate as isValidUUID } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEnity } from './entities/postinfo.entity';
import { DeleteResult, Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { CommentsEntity } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { LikeEntity } from './entities/likepost.entity';
import { CreateLikeDto } from './dto/create-likepost.dto';
import { PageOptionsDto } from './dto/page.dto';
@Injectable()
export class PostinfoService {
  constructor(
    @InjectRepository(PostEnity)
    private readonly postRepository: Repository<PostEnity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
    @InjectRepository(LikeEntity)
    private readonly likesRepository: Repository<LikeEntity>,
  ) {}
  /**
   * Todo: Create post
   *
   */
  async create(createPostinfoDto: CreatePostinfoDto): Promise<PostEnity> {
    const userid: UserEntity = new UserEntity();
    if (isValidUUID(createPostinfoDto.uid)) {
      const kiemtraND = await this.userRepository
        .createQueryBuilder('users')
        .where('users.id=:id', { id: createPostinfoDto.uid })
        .getOne();
      if (kiemtraND != null) {
        const postinfo: PostEnity = new PostEnity();
        postinfo.title = createPostinfoDto.title;
        postinfo.contentpost = createPostinfoDto.contentpost;
        postinfo.image = createPostinfoDto.image;
        userid.id = createPostinfoDto.uid;
        postinfo.user = userid;
        postinfo.user.username=kiemtraND.username;
        postinfo.user.email=kiemtraND.email;
        await this.postRepository.manager.save(postinfo);
        return postinfo;
      } else {
        this.thowExceoption('Vui lòng đăng nhập để viết post');
      }
    } else {
      this.thowExceoption('Vui lòng đăng nhập để viết post');
    }
  }
  thowExceoption(message: string) {
    throw new HttpException(message, HttpStatus.BAD_REQUEST);
  }

  async findAllPostOfUser(pagedto:PageOptionsDto ): Promise<any> {
    try{
       const skip = (pagedto.page-1)*pagedto.limit;
        const data=await this.postRepository.createQueryBuilder('post')
      .leftJoin('post.user','users').select(['post.id','post.title','post.contentpost','post.createdAt','users.id',
      'users.username','users.avatar'])
      .orderBy(`post.${pagedto.sort}`,pagedto.order)
      .take(pagedto.limit).skip(skip)
      .getMany();
      return {
        data:data,
        page: pagedto.page,
        limt: pagedto.limit,
      };
    }catch(e)
    {
        throw new HttpException(e.message,HttpStatus.BAD_REQUEST);
    }
  }

  //API trả về các bài post của user bất kỳ.
  async findAnyUserPost(username: string,pagedto:PageOptionsDto): Promise<any> {
    const skip = (pagedto.page-1)*pagedto.limit;
       const postUser= await this.postRepository.createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user').skip(skip).take(pagedto.limit)
        .where('user.username LIKE :name', { name: `${username}%` }).select(['post.id','post.title','post.contentpost','post.createdAt','user.username','user.id',])
        .getMany();
      if(postUser)
      {
        return {
          user:{
            postUser
          }
        };
      }else
      {
         throw new HttpException("User not found",HttpStatus.BAD_REQUEST);
      }
      
        
    
  }
  //API trả về danh sách các comment của 1 bài post bất kỳ.
  async findAllCommentsByPostId(postid: string): Promise<any> {
    const post: PostEnity = new PostEnity();
    const itemsComment = 5;
    post.id = postid;
    if (
      isValidUUID(post.id) &&
      (await this.postRepository.findOneBy({ id: post.id }))
    ) {
      const array = await this.commentsRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoinAndSelect('comment.post', 'post')
        .where('post.id = :postId', { postId: post.id })
        .select([
          'post.id',
          'user.username',
          'user.id',
          'post.contentpost',
          'comment.content',
          'comment.createdAt',
        ]).orderBy('comment.createdAt','DESC')
        .getMany();
      return array;
    } else {
      throw new HttpException(
        'Không tìm thấy bài post',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  //Nguoi dung comment bai post
  async commentPost(
    createcommentdto: CreateCommentDto,
  ): Promise<any> {
    let user: UserEntity = new UserEntity();
    let post: PostEnity = new PostEnity();
    user.id = createcommentdto.user;
    post.id =createcommentdto.post
    const comemnt: CommentsEntity = new CommentsEntity();
    let existsUser = await this.userRepository.findOneBy({ id:  user.id })
    if (isValidUUID(post.id) &&(existsUser)) {
       let existsPost = await this.postRepository.findOneBy({ id:  post.id });
      if (isValidUUID(user.id) &&(existsPost!=null) ) {
        //gan cho user va post
        user = existsUser;
        post = existsPost;
        comemnt.content = createcommentdto.content;
        comemnt.user = user;
        comemnt.user.avatar=user.avatar;
        comemnt.user.username=user.username;
        comemnt.post = post;
        await this.commentsRepository.save(comemnt);
        delete comemnt.id;
        delete comemnt.updated;
        return {
          comemnt:{
            post:{
              id:comemnt.post.id
            },
            id:comemnt.id,
            content:comemnt.content,
            date:comemnt.createdAt,
            user:{
              user_id:comemnt.user.id,
              username: user.username,
              avatar:user.avatar
            }
          }
        };
      } else {
        throw new HttpException('Bài post không tồn tại', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException(' Bạn chưa đang nhập', HttpStatus.BAD_REQUEST);
    }
  }
  // Nguoi dung like bai post
  async UserLikePost(createLikeDTO: CreateLikeDto): Promise<DeleteResult | any> {
    let post: PostEnity = new PostEnity();
    let user: UserEntity = new UserEntity();
    const like: LikeEntity = new LikeEntity();
    post.id = createLikeDTO.post;
    user.id = createLikeDTO.user;
    const postExists = await this.postRepository.findOneBy({ id: post.id });
    const userExists = await this.userRepository.findOneBy({ id: user.id });
    if (isValidUUID(post.id) && userExists &&isValidUUID(user.id)&&postExists) {
      const userLike = await this.likesRepository
        .createQueryBuilder('like').where('like.userId = :id and like.postId=:pid', {
          id: user.id,
          pid: post.id,
        }).getOne();
      if (userLike != null) {
        return await this.likesRepository.createQueryBuilder().delete()
          .from('Like').where('userId = :id and postId=:pid', { id: user.id, pid: post.id }).execute();
      } else {
        user =userExists ;
        post = postExists
        like.user = user;
        like.post = post;
        await this.likesRepository.save(like);
        // delete like.post;
        return {
          like:{
            id:like.id,
            post:like.post.id,
            user:like.user.id,            
            username:user.username,
            avatar:user.avatar
          }
        };
      }
    } else {
      throw new HttpException(
        'Người dùng chưa đăng nhập hoặc bài post không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //API trả về danh sách những người đã like bài post bất kỳ.
  async listPostUserLike(postid: string): Promise<UserEntity|any> {
    if(isValidUUID(postid)&& await this.postRepository.findOneBy({ id: postid}))
    {
         return await this.likesRepository
        .createQueryBuilder('like')
        .leftJoin('like.user', 'user')
        .leftJoin('like.post', 'post')
        .select(['user.username', 'user.id','user.avatar','post.id','post.title'])
        .where('post.id =:id', { id: postid})
        .getRawMany();
    }else{
      throw new HttpException("Không tìm thấy bài Post",HttpStatus.BAD_REQUEST);
   }
  }

  //API xóa post
  async deletePost(user,postid:string):Promise<any>
  {
    // console.log(user.roles.includes('Admin'))
    if(isValidUUID(postid))
    {
      const postExists = await this.postRepository.createQueryBuilder("post")
      .leftJoinAndSelect("post.user","user").select(['post.id','user.id'])
      .where("post.id= :id",{id:postid}).getOne();
      if(postExists){
      if(user['id']===postExists.user.id||user.roles.includes('Admin')){ 
           await this.postRepository.createQueryBuilder()
          .delete().from('post').where('id = :id', {id:postid })
          .execute();
          return {
            mesage: "Delete Post Successfully"
          }
         }else{
          throw new HttpException("Bạn không phải chủ bài post",HttpStatus.BAD_REQUEST);
         }
      }else{
        throw new HttpException("Không tìm thấy bài Post",HttpStatus.BAD_REQUEST);
      }
    
    }else{
      throw new HttpException("Không tìm thấy bài Post",HttpStatus.BAD_REQUEST);
    }
     
  }

  //API xóa comment 
  async deleteComment(comment_ID:string):Promise<any>
  {
    if(isValidUUID(comment_ID))
    {
      const commentExists = await this.commentsRepository.findOneBy({ id: comment_ID });

    if(commentExists)
    {
      return this.commentsRepository
      .createQueryBuilder()
      .delete()
      .from('comments')
      .where('id = :id', {id:comment_ID })
      .execute();;
    }else{
       throw new HttpException("Không tìm thấy comment",HttpStatus.BAD_REQUEST);
    }
  }
  }
}
