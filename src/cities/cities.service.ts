import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../model/city.entity';
import { CreateCityDto, UpdateCityDto } from '../dto/cities.dto';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City) private readonly repo: Repository<City>,
  ) {}

  async create(dto: CreateCityDto): Promise<City> {
    const { value } = dto;

    const newCity = new City();
    newCity.value = value;

    return await this.repo.save(newCity);
  }

  async findAll(): Promise<City[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<City> {
    const city = await this.repo.findOne(id);
    if (!city) throw new NotFoundException();

    return city;
  }

  async update(id: number, dto: UpdateCityDto): Promise<City> {
    const { value } = dto;

    const city = await this.repo.findOne(id);
    if (!city) throw new NotFoundException();

    city.value = value;
    return await this.repo.save(city);
  }

  async delete(id: number): Promise<void> {
    const city = await this.repo.findOne(id);
    if (!city) throw new NotFoundException();

    this.repo.remove(city);
  }
}
