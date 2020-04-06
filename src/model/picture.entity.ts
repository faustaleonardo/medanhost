import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class Picture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @ManyToOne(
    () => Room,
    room => room.pictures,
  )
  room: Room;
}
