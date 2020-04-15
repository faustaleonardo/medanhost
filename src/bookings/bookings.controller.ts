import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from '../model/booking.entity';
import { CreateBookingDto } from '../dto/Bookings.dto';
import { NotFoundInterceptor } from '../interceptors/errors.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/bookings')
@UseInterceptors(new NotFoundInterceptor())
export class BookingsController {
  constructor(private readonly serv: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateBookingDto, @Req() req): Promise<Booking> {
    return this.serv.create(dto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req): Promise<Booking[]> {
    return this.serv.findAll(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Booking> {
    return this.serv.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/stripe')
  payWithStripe(@Param('id') id: number, @Body() data: any): Promise<Booking> {
    return this.serv.payWithStripe(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() data: any): Promise<Booking> {
    return this.serv.update(id, data);
  }
}
