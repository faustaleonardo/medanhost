import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../model/room.entity';
import { CreateRoomDto } from '../dto/rooms.dto';
import { UsersService } from '../users/users.service';
import { TypesService } from '../types/types.service';
import { CitiesService } from '../cities/cities.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly repo: Repository<Room>,
    private readonly typesServ: TypesService,
    private readonly citiesServ: CitiesService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersServ: UsersService,
  ) {}

  async create(dto: CreateRoomDto): Promise<Room> {
    const {
      name,
      userId,
      typeId,
      cityId,
      address,
      bedrooms,
      beds,
      baths,
      description,
    } = dto;

    const newRoom = new Room();
    newRoom.name = name;
    newRoom.address = address;
    newRoom.bedrooms = bedrooms;
    newRoom.beds = beds;
    newRoom.baths = baths;
    newRoom.description = description;

    const user = await this.usersServ.findOne(userId);
    newRoom.user = user;

    const type = await this.typesServ.findOne(typeId);
    newRoom.type = type;

    const city = await this.citiesServ.findOne(cityId);
    newRoom.city = city;
    return await this.repo.save(newRoom);
  }

  async findAll(): Promise<Room[]> {
    return await this.repo.find({
      relations: ['user', 'type', 'city', 'bookmarks', 'prices', 'pictures'],
    });
  }

  async findOne(id: number): Promise<Room> {
    const Room = await this.repo.findOne(id, {
      relations: ['user', 'type', 'city', 'bookmarks', 'prices', 'pictures'],
    });
    if (!Room) throw new NotFoundException();

    return Room;
  }

  async update(id: number, data: any): Promise<Room> {
    const {
      name,
      typeId,
      cityId,
      address,
      bedrooms,
      beds,
      baths,
      description,
    } = data;

    const room = await this.repo.findOne(id);
    if (!room) throw new NotFoundException();

    if (name) room.name = name;
    if (address) room.address = address;
    if (bedrooms) room.bedrooms = bedrooms;
    if (beds) room.beds = beds;
    if (baths) room.baths = baths;
    if (description) room.description = description;

    if (typeId) {
      const type = await this.typesServ.findOne(typeId);
      room.type = type;
    }

    if (cityId) {
      const city = await this.citiesServ.findOne(cityId);
      room.city = city;
    }

    await this.repo.save(room);

    return this.repo.findOne(id, {
      relations: ['user', 'type', 'city'],
    });
  }

  async delete(id: number): Promise<void> {
    const Room = await this.repo.findOne(id);
    if (!Room) throw new NotFoundException();

    await this.repo.remove(Room);
  }
}
