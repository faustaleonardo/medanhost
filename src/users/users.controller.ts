import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../model/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { CreateBookmarkDto } from '../dto/bookmarks.dto';
import { NotFoundInterceptor } from '../interceptors/errors.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/users')
@UseInterceptors(new NotFoundInterceptor())
export class UsersController {
  constructor(private readonly serv: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.serv.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/bookmarks')
  bookmark(@Body() dto: CreateBookmarkDto): Promise<User> {
    return this.serv.bookmark(dto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.serv.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/auth')
  findOne(@Request() req): Promise<User> {
    const { id } = req.user;
    return id ? this.serv.findOne(id) : null;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateUserDto): Promise<User> {
    return this.serv.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.serv.delete(id);
  }
}
