import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Room } from './room.entity';
import { Booking } from './booking.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  googleId: string;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @ManyToOne(
    () => Role,
    role => role.users,
  )
  role: Role;

  // host
  @OneToMany(
    () => Room,
    room => room.user,
  )
  @JoinColumn()
  rooms: Room[];

  // guest
  @OneToMany(
    () => Booking,
    booking => booking.user,
  )
  @JoinColumn()
  bookings: Booking[];

  @ManyToMany(
    () => Room,
    room => room.bookmarks,
  )
  @JoinTable()
  bookmarks: Room[];
}
