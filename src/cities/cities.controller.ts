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
import { CitiesService } from './cities.service';
import { City } from '../model/city.entity';
import { CreateCityDto, UpdateCityDto } from '../dto/cities.dto';
import { NotFoundInterceptor } from '../interceptors/errors.interceptor';

@Controller('api/v1/cities')
@UseInterceptors(new NotFoundInterceptor())
export class CitiesController {
  constructor(private readonly serv: CitiesService) {}

  @Post()
  create(@Body() dto: CreateCityDto): Promise<City> {
    return this.serv.create(dto);
  }

  @Get()
  findAll(): Promise<City[]> {
    return this.serv.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<City> {
    return this.serv.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCityDto): Promise<City> {
    return this.serv.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.serv.delete(id);
  }
}
