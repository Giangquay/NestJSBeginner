import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { PostinfoService } from './postinfo.service';
import { CreatePostinfoDto } from './dto/create-postinfo.dto';
import { UpdatePostinfoDto } from './dto/update-postinfo.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateLikeDto } from './dto/create-likepost.dto';
import { PageOptionsDto  } from './dto/page.dto';
import { pick } from 'src/handler/handler';
@UsePipes(new ValidationPipe({ transform: true}))
@Controller('post')
export class PostinfoController {
  constructor(private readonly postinfoService: PostinfoService) {}


  //TODO: tao bài post
  @Post()
  create(@Body() createPostinfoDto: CreatePostinfoDto) {
    return this.postinfoService.create(createPostinfoDto);
  }

  // TODO: Danh sach cac bai post
  @Get()
  @UsePipes(ValidationPipe)
  findAll(@Query() pagedto:PageOptionsDto ){
    const options = pick(pagedto,['page','limit','sort','order']);
    const listPost = this.postinfoService.findAllPostOfUser(options);
    return listPost;
  }

  // TODO: Tim kiem bai post theo user bat ky
  @Get("users")
  findPostByUserAny(@Body() body:{username:string},@Query("page") page:number)
  {
    const name = body.username;
      return this.postinfoService.findAnyUserPost(name,page);
      // return "Tim kiem cac bai post cua user bat ky";
  }

  //Trả về danh sách các comment theo id bài post
  @Get(":id/comments")
  findAllCommentsByPostId(@Param('id') id:string)
  {
    return this.postinfoService.findAllCommentsByPostId(id);
  }

  //Người dùng thêm comment vào bài Post
  @Post("comments")
  commentPost(@Body() createCommentDto:CreateCommentDto)
  {
    return this.postinfoService.commentPost(createCommentDto);
  }
//Người dùng like 1 bài Post
  @Post("like/")
  async likePost(@Body() createLikeDTO:CreateLikeDto)
  {    
        return await this.postinfoService.UserLikePost(createLikeDTO);
  }
//TODO: Trả về danh sách những người đã like bài post bất kỳ.
  @Get(":id/like")
   listUserLikePost(@Param("id") id:string)
  {
    return this.postinfoService.listPostUserLike(id);
  }


  @Delete(":id")
  deletePostbyId(@Param("id") id:string)
  {
    return this.postinfoService.deletePost(id);
  }

  @Delete("comments/:id")
  delteCommentbyId(@Param("id") id:string){
    return this.postinfoService.deleteComment(id);
  }
}
