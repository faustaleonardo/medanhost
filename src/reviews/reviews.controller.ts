import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UseGuards,
  Req
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from '../model/review.entity';
import { CreateReviewDto } from '../dto/reviews.dto';
import { NotFoundInterceptor } from '../interceptors/errors.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/reviews')
@UseInterceptors(new NotFoundInterceptor())
export class ReviewsController {
  constructor(private readonly serv: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateReviewDto, @Req() req): Promise<Review> {
    return this.serv.create(dto, req);
  }

  @Get()
  findAll(): Promise<Review[]> {
    return this.serv.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Review> {
    return this.serv.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/rooms/:roomId')
  findOneByRoomId(@Param('roomId') roomId: number, @Req() req): Promise<Review> {
    return this.serv.findOneByRoomId(roomId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() data: any): Promise<Review> {
    return this.serv.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.serv.delete(id);
  }
}
