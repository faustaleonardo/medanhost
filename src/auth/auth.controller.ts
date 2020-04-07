import {
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateOtpDto } from '../dto/otps.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly serv: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req: any) {
    const { jwt } = req.user;
    return jwt ? jwt : new InternalServerErrorException();
  }

  @Post('otp')
  sendOTPCode(@Body() dto: CreateOtpDto): void {
    const { email } = dto;
    this.serv.sendOTPCode(email);
  }
}
