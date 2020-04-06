import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authServ: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: any, done: Function) {
    try {
      const validClaims = await this.authServ.verifyTokenClaims(payload);
      if (!validClaims) {
        return done(new UnauthorizedException('Invalid token claims'), false);
      }

      done(null, payload);
    } catch (err) {
      throw new UnauthorizedException('Unauthorized', err.message);
    }
  }
}
