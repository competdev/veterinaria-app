import { Test, TestingModule } from '@nestjs/testing';
import { HemogramExamController } from './hemogram-exam.controller';

describe('HemogramExamController', () => {
  let controller: HemogramExamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HemogramExamController],
    }).compile();

    controller = module.get<HemogramExamController>(HemogramExamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
