import { Module } from '@nestjs/common';
import { JobRunnerModule } from '../job-runner';

@Module({
    imports: [JobRunnerModule]
})
export class FacadeModule {}
