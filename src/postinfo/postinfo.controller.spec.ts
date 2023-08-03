import { Test, TestingModule } from '@nestjs/testing';
import { PostinfoController } from './postinfo.controller';
import { PostinfoService } from './postinfo.service';

describe('PostinfoController', () => {
  let controller: PostinfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostinfoController],
      providers: [PostinfoService],
    }).compile();

    controller = module.get<PostinfoController>(PostinfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
