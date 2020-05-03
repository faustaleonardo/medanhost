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
import { CreateBookingDto } from '../dto/bookings.dto';
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
  @Get('/all')
  findAll(): Promise<Booking[]> {
    return this.serv.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAllBelongsToOneGuest(@Req() req: any): Promise<Booking[]> {
    return this.serv.findAllBelongsToOneGuest(req);
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

  /** host */
  // Income Group By Month
  @UseGuards(JwtAuthGuard)
  @Get('/incomes/month')
  getIncomeGroupByMonth(@Req() req: any): Promise<any> {
    return this.serv.getIncomeGroupByMonth(req);
  }

  // Income Group By Year
  @UseGuards(JwtAuthGuard)
  @Get('/incomes/year')
  getIncomeByYear(@Req() req: any): Promise<any> {
    return this.serv.getIncomeByYear(req);
  }

  /** admin */
  @UseGuards(JwtAuthGuard)
  @Get('/transactions/month')
  getTransactionGroupByMonth(@Req() req: any): Promise<any> {
    return this.serv.getTransactionGroupByMonth(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/transactions/year')
  getTransactionGroupByYear(@Req() req: any): Promise<any> {
    return this.serv.getTransactionGroupByYear(req);
  }
}
