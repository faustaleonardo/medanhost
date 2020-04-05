import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
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

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Type)
  @JoinColumn()
  type: Type;

  @OneToOne(() => City)
  @JoinColumn()
  city: City;
}
