import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../model/booking.entity';
import { CreateBookingDto } from '../dto/bookings.dto';
import { UsersService } from '../users/users.service';
import { RoomsService } from '../rooms/rooms.service';

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

  async create(dto: CreateBookingDto): Promise<Booking> {
    // CHANGE TO AUTH USER LATER
    const userId = 2;
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

  async findAll(): Promise<Booking[]> {
    return await this.repo.find({
      relations: ['user', 'room'],
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
}
