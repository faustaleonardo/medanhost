import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Room } from './room.entity';

@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: number;

  @Column()
  guests: number;

  @Column('decimal')
  price: number;

  @ManyToOne(
    () => Room,
    room => room.prices,
  )
  room: Room;
}
