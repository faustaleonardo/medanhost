import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PicturesController } from './pictures.controller';
import { PicturesService } from './pictures.service';
import { RoomsModule } from '../rooms/rooms.module';
import { Picture } from '../model/picture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Picture]), RoomsModule],
  controllers: [PicturesController],
  providers: [PicturesService],
})
export class PicturesModule {}
