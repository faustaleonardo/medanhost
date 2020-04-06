import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Room } from './room.entity';

@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

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
