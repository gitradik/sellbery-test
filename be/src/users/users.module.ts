import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FileService } from '../file.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    FileService
  ]
})
export class UsersModule {}
