import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateOtpDto, VerifyOtpDto } from '../dto/otps.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly serv: AuthService) {}

  @Post('otp/create')
  createOTPCode(@Body() dto: CreateOtpDto): Promise<string> {
    return this.serv.createOTPCode(dto);
  }

  @Post('otp/verify')
  verifyOTPCode(@Body() dto: VerifyOtpDto): Promise<string> {
    return this.serv.verifyOTPCode(dto);
  }
}
