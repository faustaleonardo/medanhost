import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Type } from './type.entity';
import { City } from './city.entity';

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

  @ManyToMany(
    () => User,
    user => user.bookmarks,
  )
  @JoinColumn()
  bookmarks: User[];
}
