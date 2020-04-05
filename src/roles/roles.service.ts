import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../model/role.entity';
import { CreateRoleDto, UpdateRoleDto } from '../dto/roles.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly repo: Repository<Role>,
  ) {}

  async create(role: CreateRoleDto): Promise<Role> {
    const { value } = role;

    const newRole = new Role();
    newRole.value = value;

    return await this.repo.save(newRole);
  }

  async findAll(): Promise<Role[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.repo.findOne(id);
    if (!role) throw new NotFoundException();

    return role;
  }

  async update(id: number, dto: UpdateRoleDto): Promise<Role> {
    const { value } = dto;

    const role = await this.repo.findOne(id);
    if (!role) throw new NotFoundException();

    role.value = value;
    return await this.repo.save(role);
  }

  async delete(id: number): Promise<void> {
    const role = await this.repo.findOne(id);
    if (!role) throw new NotFoundException();

    this.repo.remove(role);
  }
}
