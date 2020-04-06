import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from '../model/booking.entity';
import { CreateBookingDto } from '../dto/Bookings.dto';
import { NotFoundInterceptor } from '../interceptors/errors.interceptor';

@Controller('api/v1/bookings')
@UseInterceptors(new NotFoundInterceptor())
export class BookingsController {
  constructor(private readonly serv: BookingsService) {}

  @Post()
  create(@Body() dto: CreateBookingDto): Promise<Booking> {
    return this.serv.create(dto);
  }

  @Get()
  findAll(): Promise<Booking[]> {
    return this.serv.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Booking> {
    return this.serv.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: any): Promise<Booking> {
    return this.serv.update(id, data);
  }
}
