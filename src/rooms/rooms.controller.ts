import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Room } from '../model/Room.entity';
import { CreateRoomDto, UpdateRoomDto } from '../dto/rooms.dto';
import { NotFoundInterceptor } from '../interceptors/errors.interceptor';

@Controller('api/v1/rooms')
@UseInterceptors(new NotFoundInterceptor())
export class RoomsController {
  constructor(private readonly serv: RoomsService) {}

  @Post()
  create(@Body() dto: CreateRoomDto): Promise<Room> {
    return this.serv.create(dto);
  }

  @Get()
  findAll(): Promise<Room[]> {
    return this.serv.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Room> {
    return this.serv.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateRoomDto): Promise<Room> {
    return this.serv.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.serv.delete(id);
  }
}
