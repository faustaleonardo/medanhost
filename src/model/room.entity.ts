import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Type } from './type.entity';
import { Picture } from './picture.entity';
import { Booking } from './booking.entity';
import { Review } from './review.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  address: string;

  @Column()
  bedrooms: number;

  @Column()
  beds: number;

  @Column()
  baths: number;

  @Column('text')
  description: string;

  @Column('text')
  guests: number;

  @Column('decimal')
  price: number;

  @ManyToOne(
    () => User,
    user => user.rooms,
  )
  user: User;

  @ManyToOne(
    () => Type,
    type => type.rooms,
  )
  type: Type;

  @OneToMany(
    () => Picture,
    picture => picture.room,
  )
  @JoinColumn()
  pictures: Picture[];

  @OneToMany(
    () => Booking,
    booking => booking.room,
  )
  @JoinColumn()
  bookings: Booking[];

  @OneToMany(
    () => Review,
    review => review.room,
  )
  @JoinColumn()
  reviews: Review[];

  @ManyToMany(
    () => User,
    user => user.bookmarks,
  )
  @JoinColumn()
  bookmarks: User[];
}
