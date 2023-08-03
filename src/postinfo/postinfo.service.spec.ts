import { Test, TestingModule } from '@nestjs/testing';
import { PostinfoService } from './postinfo.service';

describe('PostinfoService', () => {
  let service: PostinfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostinfoService],
    }).compile();

    service = module.get<PostinfoService>(PostinfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
