import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Price } from '../model/price.entity';
import { CreatePriceDto, UpdatePriceDto } from '../dto/prices.dto';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class PricesService {
  constructor(
    @InjectRepository(Price) private readonly repo: Repository<Price>,
    private readonly roomsService: RoomsService,
  ) {}

  private async createPrices(dto: any): Promise<Price[]> {
    let room: any;
    for (const el of dto) {
      const { price, guests, roomId } = el;

      const newPrice = new Price();
      newPrice.price = price;
      newPrice.guests = guests;

      room = await this.roomsService.findOne(roomId);
      newPrice.room = room;
      await this.repo.save(newPrice);
    }

    return await this.repo.find({ roomId: room.id });
  }

  async create(dto: [CreatePriceDto]): Promise<Price[]> {
    return await this.createPrices(dto);
  }

  async findAll(): Promise<Price[]> {
    return await this.repo.find();
  }

  async findAllByRoomId(roomId: number): Promise<Price[]> {
    return await this.repo.find({ roomId });
  }

  async findOne(id: number): Promise<Price> {
    const price = await this.repo.findOne(id);
    if (!price) throw new NotFoundException();

    return price;
  }

  async update(roomId: number, dto: [UpdatePriceDto]): Promise<Price[]> {
    const room = await this.repo.findOne({ roomId });
    if (!room) throw new NotFoundException();

    await this.repo.delete(roomId);

    return await this.createPrices(dto);
  }

  async deleteAllByRoomId(roomId: number): Promise<void> {
    const room = await this.repo.findOne({ roomId });
    if (!room) throw new NotFoundException();

    this.repo.delete({ roomId });
  }
}
