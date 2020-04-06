import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypesModule } from './types/types.module';
import { RoomsModule } from './rooms/rooms.module';
import { PricesModule } from './prices/prices.module';
import { PicturesModule } from './pictures/pictures.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    UsersModule,
    RolesModule,
    TypesModule,
    RoomsModule,
    PricesModule,
    PicturesModule,
    BookingsModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
