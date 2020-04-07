import {
  Controller,
  Get,
  UseGuards,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
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

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  protectedResource() {
    return 'JWT is working';
  }
}
