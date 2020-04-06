import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from '../model/review.entity';
import { CreateReviewDto } from '../dto/reviews.dto';
import { NotFoundInterceptor } from '../interceptors/errors.interceptor';

@Controller('api/v1/reviews')
@UseInterceptors(new NotFoundInterceptor())
export class ReviewsController {
  constructor(private readonly serv: ReviewsService) {}

  @Post()
  create(@Body() dto: CreateReviewDto): Promise<Review> {
    return this.serv.create(dto);
  }

  @Get()
  findAll(): Promise<Review[]> {
    return this.serv.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Review> {
    return this.serv.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: any): Promise<Review> {
    return this.serv.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.serv.delete(id);
  }
}
