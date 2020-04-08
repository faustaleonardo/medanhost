import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { Picture } from '../model/picture.entity';
import { NotFoundInterceptor } from '../interceptors/errors.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/pictures')
@UseInterceptors(new NotFoundInterceptor())
export class PicturesController {
  constructor(private readonly serv: PicturesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('rooms/:roomId')
  create(
    @Param('roomId') roomId: number,
    @Req() req: any,
    @Res() res: any,
  ): Promise<Picture[]> {
    return this.serv.create(roomId, req, res);
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
  @Delete('/rooms/:roomId')
  deleteAll(@Param('roomId') roomId: number) {
    return this.serv.deleteAll(roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.serv.delete(id);
  }
}
