import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { PricesService } from './prices.service';
import { Price } from '../model/price.entity';
import { CreatePriceDto, UpdatePriceDto } from '../dto/prices.dto';
import { NotFoundInterceptor } from '../interceptors/errors.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/prices')
@UseInterceptors(new NotFoundInterceptor())
export class PricesController {
  constructor(private readonly serv: PricesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePriceDto): Promise<Price> {
    return this.serv.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Price[]> {
    return this.serv.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Price> {
    return this.serv.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  update(@Param() id: number, @Body() dto: UpdatePriceDto): Promise<Price> {
    return this.serv.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.serv.delete(id);
  }
}
