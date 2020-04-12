import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  roleId: number;

  @Column()
  code: number;

  @Column()
  expiredTime: Date;
}
