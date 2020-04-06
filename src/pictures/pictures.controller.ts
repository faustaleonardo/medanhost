import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { Picture } from '../model/picture.entity';
import { CreatePictureDto } from '../dto/pictures.dto';
import { NotFoundInterceptor } from '../interceptors/errors.interceptor';

@Controller('api/v1/pictures')
@UseInterceptors(new NotFoundInterceptor())
export class PicturesController {
  constructor(private readonly serv: PicturesService) {}

  @Post()
  create(@Body() dto: CreatePictureDto): Promise<Picture> {
    return this.serv.create(dto);
  }

  @Get()
  findAll(): Promise<Picture[]> {
    return this.serv.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Picture> {
    return this.serv.findOne(id);
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.serv.delete(id);
  }
}
