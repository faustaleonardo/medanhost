import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Room } from '../model/room.entity';
import { CreateRoomDto } from '../dto/rooms.dto';
import { UsersService } from '../users/users.service';
import { TypesService } from '../types/types.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly repo: Repository<Room>,
    private readonly typesServ: TypesService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersServ: UsersService,
  ) {}

  async create(dto: CreateRoomDto, @Req() req): Promise<Room> {
    const {
      name,
      typeId,
      location,
      bedrooms,
      beds,
      baths,
      description,
      guests,
      price,
    } = dto;

    const newRoom = new Room();
    newRoom.name = name;
    newRoom.location = location;
    newRoom.bedrooms = bedrooms;
    newRoom.beds = beds;
    newRoom.baths = baths;
    newRoom.description = description;
    newRoom.guests = guests;
    newRoom.price = price;

    const user = await this.usersServ.findOne(req.user.id);
    newRoom.user = user;

    const type = await this.typesServ.findOne(typeId);
    newRoom.type = type;

    return await this.repo.save(newRoom);
  }

  async findAll(@Req() req): Promise<Room[]> {
    const {
      location,
      checkInDate,
      guests,
      type,
      minPrice,
      maxPrice,
    } = req.query;

    // user can't check in if have booking with the same check in date
    const d = new Date(checkInDate);
    d.setDate(d.getDate() + 1);
    const formattedCheckInDate = d.toISOString();

    const queryBuilder = await this.repo
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.user', 'user')
      .leftJoinAndSelect('room.type', 'type')
      .leftJoinAndSelect('room.bookmarks', 'bookmarks')
      .leftJoinAndSelect('room.pictures', 'pictures')
      // required query
      .leftJoinAndSelect(
        'room.bookings',
        'bookings',
        ':checkInDate BETWEEN bookings.checkInDate AND bookings.checkOutDate AND bookings.active = true',
        {
          checkInDate: formattedCheckInDate,
        },
      );

    // required query
    queryBuilder
      .where('room.location like :location', {
        location: `%${location}%`,
      })
      .andWhere('room.guests >= :guests', { guests });

    if (minPrice && maxPrice) {
      queryBuilder.andWhere(
        'room.price >= :minPrice AND room.price <= :maxPrice',
        { minPrice, maxPrice },
      );
    }
    const formattedType = type.split(',');
    formattedType.forEach(el => el * 1);

    if (type.length) {
      queryBuilder.andWhere('room.type.id IN (:...type)', { type: formattedType });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Room> {
    const Room = await this.repo.findOne(id, {
      relations: ['user', 'type', 'bookmarks', 'pictures'],
    });
    if (!Room) throw new NotFoundException();

    return Room;
  }

  async update(id: number, data: any): Promise<Room> {
    const {
      name,
      typeId,
      location,
      bedrooms,
      beds,
      baths,
      description,
      guests,
      price,
    } = data;

    const room = await this.repo.findOne(id);
    if (!room) throw new NotFoundException();

    if (name) room.name = name;
    if (location) room.location = location;
    if (bedrooms) room.bedrooms = bedrooms;
    if (beds) room.beds = beds;
    if (baths) room.baths = baths;
    if (description) room.description = description;
    if (guests) room.guests = guests;
    if (price) room.price = price;

    if (typeId) {
      const type = await this.typesServ.findOne(typeId);
      room.type = type;
    }

    await this.repo.save(room);

    return this.repo.findOne(id, {
      relations: ['user', 'type'],
    });
  }

  async delete(id: number): Promise<void> {
    const Room = await this.repo.findOne(id);
    if (!Room) throw new NotFoundException();

    await this.repo.remove(Room);
  }
}
