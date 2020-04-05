import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { UsersModule } from '../users/users.module';
import { TypesModule } from '../types/types.module';
import { CitiesModule } from '../cities/cities.module';
import { Room } from '../model/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room]),
    UsersModule,
    TypesModule,
    CitiesModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
