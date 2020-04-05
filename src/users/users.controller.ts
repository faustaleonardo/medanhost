import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../model/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly serv: UsersService) {}

  @Post()
  create(@Body() user: CreateUserDto): Promise<User> {
    return this.serv.create(user);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.serv.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.serv.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateUserDto): Promise<User> {
    return this.serv.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.serv.delete(id);
  }
}
