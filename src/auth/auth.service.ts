import {
  Injectable,
  HttpStatus,
  HttpException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { OtpsService } from '../otps/otps.service';
import { RolesService } from '../roles/roles.service';
import { CreateOtpDto, VerifyOtpDto } from '../dto/otps.dto';
import { User } from '../model/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersServ: UsersService,
    private readonly emailServ: EmailService,
    private readonly otpsServ: OtpsService,
    private readonly rolesServ: RolesService,
  ) {}

  private readonly jwtSecretKey = process.env.JWT_SECRET_KEY;

  generateJWT(user: any): string {
    const payload = { id: user.id };
    const jwt = sign(payload, this.jwtSecretKey, {
      expiresIn: 30 * 24 * 60 * 60 * 1000,
    });
    return jwt;
  }

  // jwt
  async verifyTokenClaims(payload: any): Promise<boolean> {
    const user = await this.usersServ.findOne(payload.id);
    return user ? true : false;
  }

  // otp
  async createOTPCode(dto: CreateOtpDto): Promise<string> {
    const { email, roleId } = dto;
    // if existing user try to login with wrong role
    const user = await this.usersServ.findOneByEmail(email);
    if (user && user.role.id !== roleId) {
      throw new HttpException(`This email has been registered as a ${user.role.value}`, HttpStatus.FORBIDDEN);
    }

    try {
      // create otp or update if it exists
      let otp = await this.otpsServ.findOneByEmail(email);
      if (otp) otp = await this.otpsServ.update({ email, roleId });
      else otp = await this.otpsServ.create({ email, roleId });

      // send email
      const credentials = {
        firstName: otp.firstName,
        email: otp.email,
      };

      await this.emailServ.sendOtpCode(credentials, otp.code);
      return 'success';
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Something went wrong. Try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyOTPCode(dto: VerifyOtpDto): Promise<any> {
    const { code, roleId } = dto;
    let role;
    const otp = await this.otpsServ.findOneByCode(code);

    if (otp) {
      if (otp.expiredTime < new Date()) {
        throw new HttpException(
          'This OTP code is no longer valid. Please resend your email.',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      // if user try to verify OTP with wrong role
      if (otp.roleId !== roleId) {
        role = await this.rolesServ.findOne(otp.roleId);
        throw new HttpException(
          `This email has been registered as a ${role.value}.`,
          HttpStatus.FORBIDDEN
        );
      }

      // if user exists
      const user = await this.usersServ.findOneByEmail(otp.email);
      if (user) {
        await this.otpsServ.delete(otp.id);
        return {
          user: user,
          jwt: this.generateJWT(user)
        }
      }

      // create a new user
      const newUser = new User();
      newUser.email = otp.email;
      newUser.firstName = otp.firstName;
      role = await this.rolesServ.findOne(otp.roleId);
      newUser.role = role;

      // delete otp from DB
      await this.otpsServ.delete(otp.id);
      await this.userRepo.save(newUser);
      return {
        user: newUser,
        jwt: this.generateJWT(newUser)
      }
    } else {
      throw new HttpException(
        'Invalid OTP Code',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
