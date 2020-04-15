import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../model/booking.entity';
import { CreateBookingDto } from '../dto/bookings.dto';
import { UsersService } from '../users/users.service';
import { RoomsService } from '../rooms/rooms.service';
import axios from 'axios';
import Stripe from 'stripe';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly repo: Repository<Booking>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersServ: UsersService,
    @Inject(forwardRef(() => RoomsService))
    private readonly roomsServ: RoomsService,
  ) {}

  async create(dto: CreateBookingDto, @Req() req): Promise<Booking> {
    console.log('come here');
    const userId = req.user.id;
    const { roomId, checkInDate, checkOutDate, guests, price } = dto;

    const newBooking = new Booking();
    newBooking.checkInDate = checkInDate;
    newBooking.checkOutDate = checkOutDate;
    newBooking.guests = guests;
    newBooking.price = price;
    newBooking.statusPayment = false;
    newBooking.active = true;

    const fiveDaysFromToday = 5 * 24 * 60 * 60 * 1000;
    newBooking.expiredDate = new Date(new Date().getTime() + fiveDaysFromToday);
    newBooking.createdAt = new Date();
    newBooking.updatedAt = new Date();

    const user = await this.usersServ.findOne(userId);
    newBooking.user = user;

    const room = await this.roomsServ.findOne(roomId);
    newBooking.room = room;

    return await this.repo.save(newBooking);
  }

  async findAll(@Req() req): Promise<Booking[]> {
    const userId = req.user.id;
    const user = await this.usersServ.findOne(userId);

    return await this.repo.find({
      relations: ['user', 'room'],
      where: { user },
    });
  }

  async findOne(id: number): Promise<Booking> {
    const Booking = await this.repo.findOne(id, {
      relations: ['user', 'room'],
    });
    if (!Booking) throw new NotFoundException();

    return Booking;
  }

  async update(id: number, data: any): Promise<Booking> {
    const { statusPayment, active } = data;

    const booking = await this.repo.findOne(id);
    if (!booking) throw new NotFoundException();

    if (statusPayment !== undefined) booking.statusPayment = statusPayment;
    if (active !== undefined) booking.active = active;

    booking.updatedAt = new Date();

    return await this.repo.save(booking);
  }

  async payWithStripe(id: number, data: any): Promise<Booking> {
    const booking = await this.repo.findOne(id);
    if (!booking) throw new NotFoundException();

    // charge stripe
    const { token } = data;
    const price = booking.price;
    const response = await axios.get(
      'https://api.exchangeratesapi.io/latest?base=USD&symbols=USD,IDR',
    );
    const rate = response.data.rates.IDR;

    // 100 cents = 1 dollar
    const amount = Math.floor(price / rate) * 100;

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: null,
      typescript: true,
    });

    await stripe.charges.create({
      amount,
      currency: 'USD',
      description: `MEDANHOST XYZ. Pay for the booking ID: ${booking.id}`,
      source: token,
    });

    // update DB
    booking.active = false;
    booking.statusPayment = true;
    booking.updatedAt = new Date();
    return await this.repo.save(booking);
  }
}
