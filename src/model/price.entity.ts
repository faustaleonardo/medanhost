import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
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

  @OneToOne(() => Room)
  @JoinColumn()
  room: Room;
  k;
}
