import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypesModule } from './types/types.module';
import { RoomsModule } from './rooms/rooms.module';
import { PicturesModule } from './pictures/pictures.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { OtpsModule } from './otps/otps.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    UsersModule,
    RolesModule,
    TypesModule,
    RoomsModule,
    PicturesModule,
    BookingsModule,
    ReviewsModule,
    AuthModule,
    EmailModule,
    OtpsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
