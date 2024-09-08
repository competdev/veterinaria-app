import { Test, TestingModule } from '@nestjs/testing';
import { JobRunnerService } from './job-runner.service';

describe('JobRunnerService', () => {
  let service: JobRunnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobRunnerService],
    }).compile();

    service = module.get<JobRunnerService>(JobRunnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
