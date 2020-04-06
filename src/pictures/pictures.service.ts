import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Picture } from '../model/picture.entity';
import { CreatePictureDto } from '../dto/pictures.dto';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class PicturesService {
  constructor(
    @InjectRepository(Picture) private readonly repo: Repository<Picture>,
    private readonly roomsService: RoomsService,
  ) {}

  async create(dto: CreatePictureDto): Promise<Picture> {
    const { roomId, path } = dto;

    // UPLOADING IMAGE - PENDING
    const newPicture = new Picture();
    newPicture.path = path;

    const room = await this.roomsService.findOne(roomId);
    newPicture.room = room;
    return await this.repo.save(newPicture);
  }

  async findAll(): Promise<Picture[]> {
    return await this.repo.find({ relations: ['room'] });
  }

  async findOne(id: number): Promise<Picture> {
    const picture = await this.repo.findOne(id, { relations: ['room'] });
    if (!picture) throw new NotFoundException();

    return picture;
  }

  async delete(id: number): Promise<void> {
    const picture = await this.repo.findOne(id);
    if (!picture) throw new NotFoundException();

    // DELETING IMAGE - PENDING
    this.repo.delete(picture);
  }
}
