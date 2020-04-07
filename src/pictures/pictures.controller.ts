import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { Picture } from '../model/picture.entity';
import { CreatePictureDto } from '../dto/pictures.dto';
import { NotFoundInterceptor } from '../interceptors/errors.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/pictures')
@UseInterceptors(new NotFoundInterceptor())
export class PicturesController {
  constructor(private readonly serv: PicturesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePictureDto): Promise<Picture> {
    return this.serv.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Picture[]> {
    return this.serv.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Picture> {
    return this.serv.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.serv.delete(id);
  }
}
