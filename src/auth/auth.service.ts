import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UsersService } from '../users/users.service';

export enum Provider {
  GOOGLE = 'google',
}

@Injectable()
export class AuthService {
  constructor(private readonly usersServ: UsersService) {}

  private readonly jwtSecretKey = process.env.JWT_SECRET_KEY;

  async validateOAuthLogin(profile: any, provider: Provider): Promise<string> {
    try {
      let user = await this.usersServ.findOneByThirdPartyId(profile.id);
      if (!user) {
        // create new user
        const { sub, email } = profile._json;
        const firstName = profile._json.given_name;
        const lastName = profile._json.family_name;

        const newUser = {
          email,
          googleId: sub,
          firstName,
          lastName,
          roleId: 2, // host
        };
        user = await this.usersServ.create(newUser);
      }
      // create jwt
      const payload = { id: user.id, provider };
      const jwt = sign(payload, this.jwtSecretKey, {
        expiresIn: 30 * 24 * 60 * 60 * 1000,
      });
      return jwt;
    } catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }

  async verifyTokenClaims(payload: any): Promise<boolean> {
    const user = await this.usersServ.findOne(payload.id);
    return user ? true : false;
  }
}
