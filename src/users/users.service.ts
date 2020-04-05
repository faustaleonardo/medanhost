import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../model/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const { googleId, email, firstName, lastName } = dto;

    const newUser = new User();
    newUser.googleId = googleId;
    newUser.email = email;
    newUser.firstName = firstName;
    newUser.lastName = lastName;

    return await this.repo.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.repo.findOne(id);
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const { firstName, lastName } = dto;

    const user = await this.repo.findOne(id);
    user.firstName = firstName;
    user.lastName = lastName;
    await this.repo.save(user);

    return await this.repo.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
