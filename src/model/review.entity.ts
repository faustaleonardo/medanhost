import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Room } from './room.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  ratings: number;

  @Column('text')
  comments: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @ManyToOne(
    () => User,
    user => user.reviews,
  )
  user: User;

  @ManyToOne(
    () => Room,
    room => room.reviews,
  )
  room: Room;
}
