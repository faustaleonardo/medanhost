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

  @OneToMany(
    () => Room,
    room => room.user,
  )
  @JoinColumn()
  rooms: Room[];

  @ManyToMany(
    () => Room,
    room => room.bookmarks,
  )
  @JoinTable()
  bookmarks: Room[];
}
