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
import { CitiesService } from './cities.service';
import { City } from '../model/city.entity';
import { CreateCityDto, UpdateCityDto } from '../dto/cities.dto';
import { NotFoundInterceptor } from '../interceptors/errors.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/cities')
@UseInterceptors(new NotFoundInterceptor())
export class CitiesController {
  constructor(private readonly serv: CitiesService) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCityDto): Promise<City> {
    return this.serv.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.serv.delete(id);
  }
}
