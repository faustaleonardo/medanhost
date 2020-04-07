import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpsService } from './otps.service';
import { OtpsController } from './otps.controller';
import { Otp } from '../model/otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  controllers: [OtpsController],
  providers: [OtpsService],
  exports: [OtpsService],
})
export class OtpsModule {}
