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

  async create(dto: CreatePriceDto): Promise<Price> {
    const { price, guests, roomId } = dto;

    const newPrice = new Price();
    newPrice.price = price;
    newPrice.guests = guests;

    const room = await this.roomsService.findOne(roomId);
    newPrice.room = room;
    return await this.repo.save(newPrice);
  }

  async findAll(): Promise<Price[]> {
    return await this.repo.find({ relations: ['room'] });
  }

  async findOne(id: number): Promise<Price> {
    const price = await this.repo.findOne(id);
    if (!price) throw new NotFoundException();

    return price;
  }

  async update(id: number, dto: UpdatePriceDto): Promise<Price> {
    const { price } = dto;

    const existingPrice = await this.repo.findOne(id);
    existingPrice.price = price;

    return await this.repo.save(existingPrice);
  }

  async delete(id: number): Promise<void> {
    const price = await this.repo.findOne(id);
    if (!price) throw new NotFoundException();

    this.repo.delete(price);
  }
}
