import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../model/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { CreateBookmarkDto } from '../dto/bookmarks.dto';
import { RolesService } from '../roles/roles.service';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private readonly rolesServ: RolesService,
    @Inject(forwardRef(() => RoomsService))
    private readonly roomsServ: RoomsService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const { googleId, email, firstName, lastName, roleId } = dto;

    const newUser = new User();
    newUser.googleId = googleId;
    newUser.email = email;
    newUser.firstName = firstName;
    newUser.lastName = lastName;

    const role = await this.rolesServ.findOne(roleId);
    newUser.role = role;

    return await this.repo.save(newUser);
  }

  async bookmark(dto: CreateBookmarkDto): Promise<User> {
    // change to auth user later
    const userId = 1;
    const { roomId } = dto;

    const user = await this.repo.findOne(userId);
    const room = await this.roomsServ.findOne(roomId);

    if (user.bookmarks instanceof Array) {
      user.bookmarks = [...user.bookmarks, room];
    } else user.bookmarks = [room];

    return await this.repo.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.repo.find({ relations: ['role', 'bookmarks'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.repo.findOne(id, {
      relations: ['role', 'bookmarks'],
    });
    if (!user) throw new NotFoundException();

    return user;
  }

  async findOneByThirdPartyId(thirdPartyId: string): Promise<User> {
    return await this.repo.findOne({ googleId: thirdPartyId });
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const { firstName, lastName } = dto;

    const user = await this.repo.findOne(id);
    if (!user) throw new NotFoundException();

    user.firstName = firstName;
    user.lastName = lastName;
    await this.repo.save(user);

    return await this.repo.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const user = await this.repo.findOne(id);
    if (!user) throw new NotFoundException();

    await this.repo.remove(user);
  }
}
