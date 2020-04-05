import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Type } from '../model/type.entity';
import { CreateTypeDto, UpdateTypeDto } from '../dto/types.dto';

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(Type) private readonly repo: Repository<Type>,
  ) {}

  async create(type: CreateTypeDto): Promise<Type> {
    const { value } = type;

    const newType = new Type();
    newType.value = value;

    return await this.repo.save(newType);
  }

  async findAll(): Promise<Type[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<Type> {
    const type = await this.repo.findOne(id);
    if (!type) throw new NotFoundException();

    return type;
  }

  async update(id: number, dto: UpdateTypeDto): Promise<Type> {
    const { value } = dto;

    const type = await this.repo.findOne(id);
    if (!type) throw new NotFoundException();

    type.value = value;
    return await this.repo.save(type);
  }

  async delete(id: number): Promise<void> {
    const type = await this.repo.findOne(id);
    if (!type) throw new NotFoundException();

    this.repo.remove(type);
  }
}
