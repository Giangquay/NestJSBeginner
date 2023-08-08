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
import { map } from 'rxjs';

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
        await this.postRepository.manager.save(postinfo);
        delete postinfo.updated;
        delete postinfo.id;
        delete postinfo.user;
        return postinfo;
      } else {
        this.thowUser('Vui lòng đăng nhập để viết post');
      }
    } else {
      this.thowUser('Vui lòng đăng nhập để viết post');
    }
  }
  thowUser(message: string) {
    throw new HttpException(message, HttpStatus.BAD_REQUEST);
  }

  async findAll(page: number): Promise<PostEnity[]> {
    const itemPage = 4;
    const count = await this.postRepository.createQueryBuilder().getCount();
    let totalpage: number =
      count % itemPage != 0 ? (count % itemPage) + 1 : count / itemPage;
    if (page > totalpage) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const postinfo = await this.postRepository.find({
      take: itemPage,
      skip: itemPage * (page - 1),
    });
    return postinfo;
  }
  //API trả về các bài post của user bất kỳ.
  async findAnyUserPost(username: string, page: number): Promise<PostEnity[]> {
    const item_page = 5;
    const checkUsername = await this.userRepository
      .createQueryBuilder()
      .select('users')
      .from(UserEntity, 'users')
      .where('users.username LIKE :name', { name: `${username}%` })
      .getMany();
    if (checkUsername.length != 0) {
      return await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .skip(item_page * (page - 1))
        .take(item_page)
        .where('user.username LIKE :name', { name: 'Tran %' })
        .select([
          'post.id',
          'post.title',
          'post.contentpost',
          'user.username',
          'user.id',
        ])
        .getMany();
    } else {
      this.thowUser('Không tìm thấy user nào');
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
        ])
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
  ): Promise<CommentsEntity> {
    const user: UserEntity = new UserEntity();
    const post: PostEnity = new PostEnity();
    const comemnt: CommentsEntity = new CommentsEntity();
    //Lay id cua User va Post
    user.id = createcommentdto.user;
    post.id = createcommentdto.post;
    if (
      isValidUUID(post.id) &&
      (await this.postRepository.findOneBy({ id: post.id }))
    ) {
      //Them cac truong vao comment
      if (
        isValidUUID(user.id) &&
        (await this.userRepository.findOneBy({ id: user.id }))
      ) {
        comemnt.content = createcommentdto.content;
        comemnt.user = user;
        comemnt.post = post;
        await this.commentsRepository.save(comemnt);
        delete comemnt.id;
        return comemnt;
      } else {
        throw new HttpException('Bạn chưa đang nhập', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Bài post không tồn tại', HttpStatus.BAD_REQUEST);
    }
  }
  // Nguoi dung like bai post
  async UserLikePost(
    createLikeDTO: CreateLikeDto,
  ): Promise<DeleteResult | LikeEntity> {
    const post: PostEnity = new PostEnity();
    const user: UserEntity = new UserEntity();
    const like: LikeEntity = new LikeEntity();
    post.id = createLikeDTO.post;
    user.id = createLikeDTO.user;
    if (
      isValidUUID(post.id) &&
      (await this.postRepository.findOneBy({ id: post.id })) &&
      isValidUUID(user.id) &&
      (await this.userRepository.findOneBy({ id: user.id }))
    ) {
      const userLike = await this.likesRepository
        .createQueryBuilder('like')
        .where('like.userId = :id and like.postId=:pid', {
          id: user.id,
          pid: post.id,
        })
        .getOne();
      if (userLike != null) {
        return await this.likesRepository
          .createQueryBuilder()
          .delete()
          .from('Like')
          .where('userId = :id and postId=:pid', { id: user.id, pid: post.id })
          .execute();
      } else {
        like.user = user;
        like.post = post;
        await this.likesRepository.save(like);
        // delete like.id;
        // delete like.post;
        return like;
      }
    } else {
      throw new HttpException(
        'Người dùng chưa đăng nhập hoặc bài post không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //API trả về danh sách những người đã like bài post bất kỳ.
  async listPostUserLike(postid: string): Promise<LikeEntity[]> {
    const post: PostEnity = new PostEnity();
    const itemUser = 5;
    post.id = postid;
    let validatePost =
      isValidUUID(post.id) &&
      (await this.postRepository.findOneBy({ id: post.id }));
    if (validatePost) {
      return await this.likesRepository
        .createQueryBuilder('like')
        .leftJoin('like.user', 'user')
        .leftJoin('like.post', 'post')
        .select(['user.username', 'user.id', 'post.id'])
        .where('post.id =:id', { id: post.id })
        .getRawMany();
    } else {
      throw new HttpException('Bài post không tồn tại', HttpStatus.BAD_REQUEST);
    }
  }
}
