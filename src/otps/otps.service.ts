import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from '../model/otp.entity';
import { CreateOtpDto } from '../dto/otps.dto';

@Injectable()
export class OtpsService {
  constructor(@InjectRepository(Otp) private readonly repo: Repository<Otp>) {}

  _generateCode(): number {
    return Math.floor(100000 + Math.floor(Math.random() * 900000));
  }

  _getFiveMinutesFromNow(): Date {
    const fiveMinutesFromNow = 5 * 60 * 1000;
    return new Date(new Date().getTime() + fiveMinutesFromNow);
  }

  async create(dto: CreateOtpDto): Promise<Otp> {
    const { email } = dto;
    const firstName = email.substring(0, email.indexOf('@'));

    const otp = new Otp();
    otp.email = email;
    otp.firstName = firstName;

    otp.expiredTime = this._getFiveMinutesFromNow();
    otp.code = this._generateCode();

    return await this.repo.save(otp);
  }

  async findAll(): Promise<Otp[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<Otp> {
    const otp = await this.repo.findOne(id);
    if (!otp) throw new NotFoundException();

    return otp;
  }

  async findOneByCode(code: number): Promise<Otp> {
    return await this.repo.findOne({ code });
  }

  async findOneByEmail(email: string): Promise<Otp> {
    return await this.repo.findOne({ email });
  }

  async update(dto: CreateOtpDto): Promise<Otp> {
    const { email } = dto;
    const otp = await this.repo.findOne({ email });
    if (!otp) throw new NotFoundException();

    otp.code = this._generateCode();
    otp.expiredTime = this._getFiveMinutesFromNow();

    return await this.repo.save(otp);
  }

  async delete(id: number): Promise<void> {
    const otp = await this.repo.findOne(id);
    if (!otp) throw new NotFoundException();

    this.repo.delete(otp);
  }
}
