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
    return postinfo;
    }else{
       throw new HttpException("Vui lòng đăng nhập để viết post",HttpStatus.BAD_REQUEST);
    }
  }

  async findAll():Promise<Postinfo[]> {
    return await this.postRepository.find();
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
       
     const post:Postinfo[]= await  this.postRepository.createQueryBuilder('post').leftJoin(Users,"u","post.uid=u.id")
       .where("u.username LIKE :name", { name: `${username}%`}).getMany();
      
      return post;
    }else{
        throw new HttpException("User not found",HttpStatus.BAD_REQUEST);
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
       return  await this.commentsRepository.createQueryBuilder("comments").select(["post.image","post.title","post.contentpost","comments.content","user.username"])
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
        comemnt.content = createcommentdto.content;
        comemnt.user = user;
        comemnt.post = post;
        return await this.commentsRepository.save(comemnt);
    }
    else{
      throw new HttpException("Bài post không tồn tại",HttpStatus.BAD_REQUEST);
    }
  }
  //Nguoi dung like bai post
  async UserLikePost(postid:string,createLikeDTO:CreateLikeDto):Promise<DeleteResult|Like>
  {
      const post:Postinfo = new  Postinfo();
      const user:Users = new Users();
      const like:Like = new Like();
      post.id = postid;
      user.id=createLikeDTO.user;
      let validatePost = isValidUUID(post.id)&&await this.postRepository.findOneBy({id:post.id});
      let validateUser = await this.userRepository.findOneBy({id:user.id});
      const userLike =  await this.likesRepository.createQueryBuilder("like")
      .where("like.userId = :id and like.postId=:pid",{id:user.id,pid: post.id})
      .getOne();
      if(validatePost&&validateUser!=null){
        console.log(userLike);
        if(userLike!=null)
        {
          return await this.likesRepository.createQueryBuilder().delete().from("Like")
          .where("userId = :id and postId=:pid", { id: user.id ,pid:post.id}).execute();
        }else {
          like.user=user;
          like.post=post;
          return await this.likesRepository.save(like);
        }
      }else{validatePost
        throw new HttpException( ((validatePost) ? ((validateUser!=null)?"":"Vui lòng đăng nhập"):"Bài post không tồn tại"),HttpStatus.BAD_REQUEST);
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
        return this.userRepository.createQueryBuilder("users").innerJoinAndSelect(Like,"Like","users.id=Like.userId")
        .select("users.username").where("Like.postId=:id",{id:post.id}).getMany();
    }else{
      throw new HttpException("Bài post không tồn tại",HttpStatus.BAD_REQUEST);
    }
  }
}
