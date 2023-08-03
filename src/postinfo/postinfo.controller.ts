import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostinfoService } from './postinfo.service';
import { CreatePostinfoDto } from './dto/create-postinfo.dto';
import { UpdatePostinfoDto } from './dto/update-postinfo.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateLikeDto } from './dto/create-likepost.dto';

@Controller('post')
export class PostinfoController {
  constructor(private readonly postinfoService: PostinfoService) {}

  @Post()
  create(@Body() createPostinfoDto: CreatePostinfoDto) {
    return this.postinfoService.create(createPostinfoDto);
  }

  @Get()
  findAll() {
    return this.postinfoService.findAll();
  }

  @Get("users")
  findPostByUserAny(@Body() body:{username:string})
  {
    const name = body.username;
      return this.postinfoService.findAnyUserPost(name);
      // return "Tim kiem cac bai post cua user bat ky";
  }

  @Get(":id/comments")
  findAllCommentsByPostId(@Param('id') id:string)
  {
    return this.postinfoService.findAllCommentsByPostId(id);
  }

  @Post("comments")
  commentPost(@Body() createCommentDto:CreateCommentDto)
  {
    return this.postinfoService.commentPost(createCommentDto);
  }

  @Post("like/:id")
  async likePost(@Param('id') id:string ,@Body() createLikeDTO:CreateLikeDto)
  {    
        return await this.postinfoService.UserLikePost(id,createLikeDTO);
  }

  @Get(":id/like")
  async listUserLikePost(@Param("id") id:string)
  {
    return this.postinfoService.listPostUserLike(id);
  }
}
