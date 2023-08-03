import { Module } from '@nestjs/common';
import { PostinfoService } from './postinfo.service';
import { PostinfoController } from './postinfo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Postinfo } from './entities/postinfo.entity';
import { UsersModule } from 'src/users/users.module';
import { Users } from 'src/users/entities/user.entity';
import { Comments } from './entities/comment.entity';
import { Like } from './entities/likepost.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Postinfo,Comments,Users,Like])],
  controllers: [PostinfoController],
  providers: [PostinfoService]
})
export class PostinfoModule {}
