import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { OtpsService } from './otps.service';
import { Otp } from '../model/otp.entity';
import { CreateOtpDto } from '../dto/otps.dto';
import { NotFoundInterceptor } from '../interceptors/errors.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/otps')
@UseInterceptors(new NotFoundInterceptor())
export class OtpsController {
  constructor(private readonly serv: OtpsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateOtpDto): Promise<Otp> {
    return this.serv.create(dto);
  }

  @Get()
  findAll(): Promise<Otp[]> {
    return this.serv.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Otp> {
    return this.serv.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Body() email: string): Promise<Otp> {
    return this.serv.update(email);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.serv.delete(id);
  }
}
