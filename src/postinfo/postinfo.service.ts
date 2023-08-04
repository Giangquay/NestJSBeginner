import { HttpException, HttpStatus, Injectable, HttpExceptionBodyMessage, HttpExceptionBody } from '@nestjs/common';
import { CreatePostinfoDto } from './dto/create-postinfo.dto';
import { validate as isValidUUID } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Postinfo } from './entities/postinfo.entity';
import { DeleteResult, Repository} from "typeorm";
import { Users } from 'src/users/entities/user.entity';
import { Comments } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Like } from './entities/likepost.entity';
import { CreateLikeDto } from './dto/create-likepost.dto';

@Injectable()
export class PostinfoService {
  constructor(@InjectRepository(Postinfo) private readonly postRepository:Repository<Postinfo>,
    @InjectRepository(Users) private readonly userRepository:Repository<Users>,
    @InjectRepository(Comments) private readonly commentsRepository:Repository<Comments>,
    @InjectRepository(Like) private readonly likesRepository:Repository<Like>,
  ){

  }
  /**
   * Todo: Create post 
   * 
   */
   async create(createPostinfoDto: CreatePostinfoDto):Promise<Postinfo> {
    const userid:Users = new Users();
    if(isValidUUID(createPostinfoDto.uid))
    {
      const kiemtraND  = await this.userRepository.createQueryBuilder("users").where("users.id=:id",{id:createPostinfoDto.uid}).getOne();
      if(kiemtraND!=null)
      {
          const postinfo:Postinfo = new Postinfo();
          postinfo.title=createPostinfoDto.title;
          postinfo.contentpost=createPostinfoDto.contentpost;
          postinfo.image=createPostinfoDto.image;
          userid.id = createPostinfoDto.uid;
          postinfo.user=userid;
          await this.postRepository.manager.save(postinfo);
          delete postinfo.updateat;
          delete postinfo.id;
          delete postinfo.user;
          return postinfo;
      }else{
        this.thowUser("Vui lòng đăng nhập để viết post");
      }
    }else {
      this.thowUser("Vui lòng đăng nhập để viết post");
    }
    
  }
  thowUser(message:string )
  {
    throw new HttpException(message,HttpStatus.BAD_REQUEST);
  }

  async findAll():Promise<Postinfo[]> {
    const postRespone= await this.postRepository.createQueryBuilder("posts")
    .select(["posts.title","posts.contentpost","posts.image","posts.createat"])
    .getMany();
    return postRespone;
  }
  //API trả về các bài post của user bất kỳ.
  async findAnyUserPost(username:string):Promise<Postinfo[]>
  {
    const checkUsername = await this.userRepository.createQueryBuilder()
    .select("users")
    .from(Users, "users")
    .where("users.username LIKE :name", { name: `${username}%`}).getMany();
    if(checkUsername.length !=0)
    {
       
     const post:Postinfo[]= await  this.postRepository.createQueryBuilder('post').select(["post.title","post.contentpost"])
     .leftJoin(Users,"u","post.uid=u.id")
       .where("u.username LIKE :name", { name: `${username}%`}).getMany();
      return post;
    }else{
        this.thowUser("Không tìm thấy user nào");
    }
  }
  //API trả về danh sách các comment của 1 bài post bất kỳ.
  async findAllCommentsByPostId(postid:string):Promise<Comments[]>
  {
      const post:Postinfo = new  Postinfo();
      //Kiem tra bien dau vao
      post.id = postid;
      if(isValidUUID(post.id)&&await this.postRepository.findOneBy({id:post.id}))
      {
       return  await this.commentsRepository.createQueryBuilder("comments").select(["comments.content"])
       .innerJoin("comments.post","post")
       .innerJoin("comments.user","user")
       .where("comments.postId =:postid",{postid:postid})
       .getMany();
      }else{
          throw  new HttpException("Không tìm thấy bài post",HttpStatus.BAD_REQUEST);
      }
     
    ;
  }
  //Nguoi dung comment bai post 
  async commentPost(createcommentdto:CreateCommentDto):Promise<Comments>
  {
    const user:Users = new Users();
    const post:Postinfo = new Postinfo();
    const comemnt:Comments = new Comments();
     //Lay id cua User va Post
    user.id = createcommentdto.user;
    post.id = createcommentdto.post;
    if(isValidUUID(post.id)&&await this.postRepository.findOneBy({id:post.id}))
    {
        //Them cac truong vao comment
        if(isValidUUID(user.id)&&await this.userRepository.findOneBy({id:user.id}))
        {
          comemnt.content = createcommentdto.content;
          comemnt.user = user;
          comemnt.post = post;
          await this.commentsRepository.save(comemnt);
          delete comemnt.user;
          delete comemnt.post;
          delete comemnt.id;
          return comemnt ;
        }else{
          throw new HttpException("Bạn chưa đang nhập",HttpStatus.BAD_REQUEST);
        }
    }
    else{
      throw new HttpException("Bài post không tồn tại",HttpStatus.BAD_REQUEST);
    }
  }
  //Nguoi dung like bai post
  async UserLikePost(createLikeDTO:CreateLikeDto):Promise<DeleteResult|Like>
  {
      const post:Postinfo = new  Postinfo();
      const user:Users = new Users();
      const like:Like = new Like();
      post.id = createLikeDTO.post;
      user.id=createLikeDTO.user;  
      if(isValidUUID(post.id)&&await this.postRepository.findOneBy({id:post.id})&&
                isValidUUID(user.id)&&await this.userRepository.findOneBy({id:user.id})){
        const userLike =  await this.likesRepository.createQueryBuilder("like").where("like.userId = :id and like.postId=:pid",{id:user.id,pid: post.id}) .getOne();
        if(userLike!=null)
        {
          return await this.likesRepository.createQueryBuilder().delete().from("Like")
          .where("userId = :id and postId=:pid", { id: user.id ,pid:post.id}).execute();
        }else {
          like.user=user;
          like.post=post;
          await this.likesRepository.save(like);
          delete like.id;
          delete like.post;
          return like;
        }
      }else{
        throw new HttpException("Người dùng chưa đăng nhập hoặc bài post không tồn tại",HttpStatus.BAD_REQUEST);
      }
  }

  //API trả về danh sách những người đã like bài post bất kỳ.
   async listPostUserLike(postid:string):Promise<Users[]>
  {
    const post:Postinfo = new  Postinfo();
    post.id = postid;
    let validatePost = isValidUUID(post.id)&&await this.postRepository.findOneBy({id:post.id});
    if(validatePost)
    {
     const user= this.userRepository.createQueryBuilder("users").innerJoinAndSelect(Like,"Like","users.id=Like.userId")
        .select(["users.username","users.email"]).where("Like.postId=:id",{id:post.id}).getMany();
        if(user!=null)
        {
          return user;
        }else {
          return;
        }
    }else{
      throw new HttpException("Bài post không tồn tại",HttpStatus.BAD_REQUEST);
    }
  }
}
