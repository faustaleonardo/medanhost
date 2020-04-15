import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../model/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { CreateBookmarkDto } from '../dto/bookmarks.dto';
import { RolesService } from '../roles/roles.service';
import { RoomsService } from '../rooms/rooms.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private readonly rolesServ: RolesService,
    @Inject(forwardRef(() => RoomsService))
    private readonly roomsServ: RoomsService,
    @Inject(forwardRef(() => AuthService))
    private readonly authServ: AuthService,
  ) {}

  async create(dto: CreateUserDto): Promise<any> {
    let jwt: string;
    const { googleId, email, firstName, lastName, roleId } = dto;

    // check if user exists
    const existingUser = await this.repo.findOne(
      { email },
      { relations: ['role'] },
    );
    if (existingUser) {
      if (existingUser.role.id !== roleId) {
        throw new HttpException(
          `This email has been registered as a ${existingUser.role.value}!`,
          HttpStatus.FORBIDDEN,
        );
      }

      jwt = this.authServ.generateJWT(existingUser);
      return {
        user: existingUser,
        jwt,
      };
    }

    // create new user
    const newUser = new User();
    newUser.googleId = googleId;
    newUser.email = email;
    newUser.firstName = firstName;
    newUser.lastName = lastName;

    const role = await this.rolesServ.findOne(roleId);
    newUser.role = role;

    await this.repo.save(newUser);
    jwt = this.authServ.generateJWT(newUser);
    return {
      user: newUser,
      jwt,
    };
  }

  async createBookmark(dto: CreateBookmarkDto, @Req() req: any): Promise<User> {
    const userId = req.user.id;
    const { roomId } = dto;

    const user = await this.repo.findOne(userId, { relations: ['bookmarks'] });
    const room = await this.roomsServ.findOne(roomId);

    if (user.bookmarks instanceof Array) {
      user.bookmarks = [...user.bookmarks, room];
    } else user.bookmarks = [room];

    return await this.repo.save(user);
  }

  async deleteBookmark(roomId: number, @Req() req: any): Promise<User> {
    const userId = req.user.id;

    const user = await this.repo.findOne(userId, { relations: ['bookmarks'] });
    const filteredBookmarks = user.bookmarks.filter(el => el.id !== roomId);

    user.bookmarks = filteredBookmarks;

    return await this.repo.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.repo.find({ relations: ['role', 'bookmarks'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.repo.findOne(id, {
      relations: ['role', 'bookmarks', 'bookings'],
    });
    if (!user) throw new NotFoundException();

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.repo.findOne({ email }, { relations: ['role'] });
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
