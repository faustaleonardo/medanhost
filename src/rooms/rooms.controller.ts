import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Room } from '../model/Room.entity';
import { CreateRoomDto } from '../dto/rooms.dto';
import { NotFoundInterceptor } from '../interceptors/errors.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/rooms')
@UseInterceptors(new NotFoundInterceptor())
export class RoomsController {
  constructor(private readonly serv: RoomsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateRoomDto, @Req() req): Promise<Room> {
    return this.serv.create(dto, req);
  }

  @Get()
  findAll(@Req() req): Promise<Room[]> {
    return this.serv.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Room> {
    return this.serv.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() data: any): Promise<Room> {
    return this.serv.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.serv.delete(id);
  }
}
