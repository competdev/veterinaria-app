import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentController } from '../Controller';
import { DocumentService } from '../Service';
import { DocumentEntity } from '../Entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentEntity])],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
