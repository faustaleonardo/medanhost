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
} from '@nestjs/common';
import { TypesService } from './types.service';
import { Type } from '../model/Type.entity';
import { CreateTypeDto, UpdateTypeDto } from '../dto/types.dto';
import { NotFoundInterceptor } from '../interceptors/errors.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/types')
@UseInterceptors(new NotFoundInterceptor())
export class TypesController {
  constructor(private readonly serv: TypesService) {}

  @Post()
  create(@Body() dto: CreateTypeDto): Promise<Type> {
    return this.serv.create(dto);
  }

  @Get()
  findAll(): Promise<Type[]> {
    return this.serv.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Type> {
    return this.serv.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateTypeDto): Promise<Type> {
    return this.serv.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.serv.delete(id);
  }
}
