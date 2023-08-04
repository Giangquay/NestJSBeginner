import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostinfoService } from './postinfo.service';
import { CreatePostinfoDto } from './dto/create-postinfo.dto';
import { UpdatePostinfoDto } from './dto/update-postinfo.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateLikeDto } from './dto/create-likepost.dto';

@Controller('post')
export class PostinfoController {
  constructor(private readonly postinfoService: PostinfoService) {}


  //TODO: tao bài post
  @Post()
  create(@Body() createPostinfoDto: CreatePostinfoDto) {
    return this.postinfoService.create(createPostinfoDto);
  }

  //TODO: Danh sach cac bai post
  @Get()
  findAll() {
    return this.postinfoService.findAll();
  }

  // TODO: Tim kiem bai post theo user bat ky
  @Get("users")
  findPostByUserAny(@Body() body:{username:string})
  {
    const name = body.username;
      return this.postinfoService.findAnyUserPost(name);
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
  async listUserLikePost(@Param("id") id:string)
  {
    return this.postinfoService.listPostUserLike(id);
  }
}
