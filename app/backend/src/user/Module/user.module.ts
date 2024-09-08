import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../Controller';
import { UserService } from '../Service';
import { UserEntity, UserEntitySubscriber } from '../Entity';
import { IndicatorModule } from '../../indicator';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    IndicatorModule
  ],
  controllers: [UserController],
  providers: [UserService, UserEntitySubscriber],
  exports: [UserService]
})
export class UserModule {}
