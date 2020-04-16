import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  Req,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { Booking } from '../model/booking.entity';
import { CreateBookingDto } from '../dto/bookings.dto';
import { UsersService } from '../users/users.service';
import { RoomsService } from '../rooms/rooms.service';
import { EmailService } from '../email/email.service';
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
    private readonly emailServ: EmailService,
  ) {}

  private entityManager = getManager();

  async create(dto: CreateBookingDto, @Req() req: any): Promise<Booking> {
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

    // send email
    const credentials = {
      firstName: user.firstName,
      email: user.email,
    };
    await this.emailServ.sendPaymentReminder(credentials);

    return await this.repo.save(newBooking);
  }

  async findAll(): Promise<Booking[]> {
    return await this.repo.find({
      relations: ['user', 'room'],
    });
  }

  async findAllBelongsToOneGuest(@Req() req: any): Promise<Booking[]> {
    const userId = req.user.id;
    const user = await this.usersServ.findOne(userId);

    return await this.repo.find({
      relations: ['user', 'room'],
      where: { user },
      order: {
        createdAt: 'DESC',
      },
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

  // Group by
  async getIncomeGroupByMonth(@Req() req: any): Promise<any> {
    const { id } = req.user;

    const result = await this.entityManager.query(`
      SELECT u.id as user_id, 
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') AS month, 
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'MM') AS month_number, 
        TO_CHAR(DATE_TRUNC('year', "createdAt"), 'YYYY') AS year,
        SUM(b.price) AS total
      FROM public."booking" AS b
      INNER JOIN public."room" AS r
        ON "roomId" = r.id
        INNER JOIN public."user" AS u
          ON r."userId" = u.id
      GROUP BY 1,2,3,4
      ORDER BY 3,4 
    `);

    const filterResult = result.filter(
      (el: { user_id: any }) => el.user_id === id,
    );

    return filterResult;
  }

  async getIncomeByYear(@Req() req: any): Promise<any> {
    const { id } = req.user;

    const entityManager = getManager();
    const result = await entityManager.query(`
      SELECT u.id as user_id, 
        TO_CHAR(DATE_TRUNC('year', "createdAt"), 'YYYY') AS year,
        SUM(b.price) AS total
      FROM public."booking" AS b
      INNER JOIN public."room" AS r
        ON "roomId" = r.id
        INNER JOIN public."user" AS u
          ON r."userId" = u.id
      GROUP BY 1,2
      ORDER BY 2
    `);

    const filteredResult = result.filter(
      (el: { user_id: any }) => el.user_id === id,
    );

    return filteredResult;
  }

  async getTransactionGroupByMonth(@Req() req: any): Promise<any> {
    const { id } = req.user;

    // check if it is admin
    const user = await this.usersServ.findOne(id);
    if (user.role.id !== 1) {
      throw new HttpException(
        'Only admin can access this route',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result = await this.entityManager.query(`
      SELECT
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') AS month, 
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'MM') AS month_number, 
        TO_CHAR(DATE_TRUNC('year', "createdAt"), 'YYYY') AS year,
        count(b.id) AS total
      FROM public."booking" AS b
      GROUP BY 1,2,3
      ORDER BY 1,2,3 
    `);

    return result;
  }

  async getTransactionGroupByYear(@Req() req: any): Promise<any> {
    const { id } = req.user;

    // check if it is admin
    const user = await this.usersServ.findOne(id);
    if (user.role.id !== 1) {
      throw new HttpException(
        'Only admin can access this route',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result = await this.entityManager.query(`
      SELECT
        TO_CHAR(DATE_TRUNC('year', "createdAt"), 'YYYY') AS year,
        count(b.id) AS total
      FROM public."booking" AS b
      GROUP BY 1
      ORDER BY 1
    `);

    return result;
  }
}
