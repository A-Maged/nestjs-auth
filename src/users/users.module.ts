import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Client } from './entities/client.entity';
import { Photo } from './entities/photo.entity';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Client, Photo])],
  providers: [ClientsService],
  exports: [ClientsService],
  controllers: [UsersController],
})
export class UsersModule {}
