import { Test, TestingModule } from '@nestjs/testing';
import { HemogramExamService } from './hemogram-exam.service';

describe('HemogramExamService', () => {
  let service: HemogramExamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HemogramExamService],
    }).compile();

    service = module.get<HemogramExamService>(HemogramExamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
