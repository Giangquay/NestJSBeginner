import { Module } from '@nestjs/common';
import { PostinfoService } from './postinfo.service';
import { PostinfoController } from './postinfo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEnity } from './entities/postinfo.entity';
import { UsersModule } from 'src/users/users.module';
import { UserEntity } from 'src/users/entities/user.entity';
import { CommentsEntity } from './entities/comment.entity';
import { LikeEntity } from './entities/likepost.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PostEnity,CommentsEntity,UserEntity,LikeEntity])],
  controllers: [PostinfoController],
  providers: [PostinfoService]
})
export class PostinfoModule {}
