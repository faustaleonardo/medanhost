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
import { City } from './city.entity';
import { Price } from './price.entity';
import { Picture } from './picture.entity';

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

  @ManyToOne(
    () => City,
    city => city.rooms,
  )
  city: City;

  @OneToMany(
    () => Price,
    price => price.room,
  )
  @JoinColumn()
  prices: Price[];

  @OneToMany(
    () => Picture,
    picture => picture.room,
  )
  @JoinColumn()
  pictures: Picture[];

  @ManyToMany(
    () => User,
    user => user.bookmarks,
  )
  @JoinColumn()
  bookmarks: User[];
}
