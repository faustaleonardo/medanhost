import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from '../model/role.entity';
import { CreateRoleDto, UpdateRoleDto } from '../dto/roles.dto';

@Controller('api/v1/roles')
export class RolesController {
  constructor(private readonly serv: RolesService) {}

  @Post()
  create(@Body() dto: CreateRoleDto): Promise<Role> {
    return this.serv.create(dto);
  }

  @Get()
  findAll(): Promise<Role[]> {
    return this.serv.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Role> {
    return this.serv.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateRoleDto): Promise<Role> {
    return this.serv.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.serv.delete(id);
  }
}
