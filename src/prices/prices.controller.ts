import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { PricesService } from './prices.service';
import { Price } from '../model/price.entity';
import { CreatePriceDto, UpdatePriceDto } from '../dto/prices.dto';
import { NotFoundInterceptor } from '../interceptors/errors.interceptor';

@Controller('api/v1/prices')
@UseInterceptors(new NotFoundInterceptor())
export class PricesController {
  constructor(private readonly serv: PricesService) {}

  @Post()
  create(@Body() prices: [CreatePriceDto]): Promise<Price[]> {
    return this.serv.create(prices);
  }

  @Get()
  findAll(): Promise<Price[]> {
    return this.serv.findAll();
  }

  @Get('/rooms/:roomId')
  findAllByRoomId(@Param() roomId: number): Promise<Price[]> {
    return this.serv.findAllByRoomId(roomId);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Price> {
    return this.serv.findOne(id);
  }

  @Patch('/rooms/:roomId')
  update(
    @Param() roomId: number,
    @Body() prices: [UpdatePriceDto],
  ): Promise<Price[]> {
    return this.serv.update(roomId, prices);
  }

  @Delete('/rooms/:roomId')
  delete(@Param('roomId') roomId: number) {
    return this.serv.deleteAllByRoomId(roomId);
  }
}
