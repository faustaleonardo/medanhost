import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Room } from './room.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  checkInDate: Date;

  @Column()
  checkOutDate: Date;

  @Column()
  guests: number;

  @Column()
  price: number;

  @Column()
  statusPayment: boolean;

  @Column()
  active: boolean;

  @Column()
  expiredDate: Date;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @ManyToOne(
    () => User,
    user => user.bookings,
  )
  user: User;

  @ManyToOne(
    () => Room,
    room => room.bookings,
  )
  room: Room;
}
