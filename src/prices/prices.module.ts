import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricesController } from './prices.controller';
import { PricesService } from './prices.service';
import { RoomsModule } from '../rooms/rooms.module';
import { Price } from '../model/price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Price]), RoomsModule],
  controllers: [PricesController],
  providers: [PricesService],
})
export class PricesModule {}
