import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../model/review.entity';
import { CreateReviewDto } from '../dto/reviews.dto';
import { UsersService } from '../users/users.service';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly repo: Repository<Review>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersServ: UsersService,
    @Inject(forwardRef(() => RoomsService))
    private readonly roomsServ: RoomsService,
  ) {}

  async create(dto: CreateReviewDto): Promise<Review> {
    // CHANGE TO AUTH USER LATER
    const userId = 1;
    const { roomId, ratings, comments } = dto;

    const newReview = new Review();
    newReview.ratings = ratings;
    newReview.comments = comments;

    const user = await this.usersServ.findOne(userId);
    newReview.user = user;

    const room = await this.roomsServ.findOne(roomId);
    newReview.room = room;

    newReview.createdAt = new Date();
    newReview.updatedAt = new Date();

    return await this.repo.save(newReview);
  }

  async findAll(): Promise<Review[]> {
    return await this.repo.find({
      relations: ['user', 'room'],
    });
  }

  async findOne(id: number): Promise<Review> {
    const Review = await this.repo.findOne(id, {
      relations: ['user', 'room'],
    });
    if (!Review) throw new NotFoundException();

    return Review;
  }

  async update(id: number, data: any): Promise<Review> {
    const { ratings, comments } = data;

    const Review = await this.repo.findOne(id);
    if (!Review) throw new NotFoundException();

    if (ratings !== undefined) Review.ratings = ratings;
    if (comments !== undefined) Review.comments = comments;

    Review.updatedAt = new Date();

    return await this.repo.save(Review);
  }

  async delete(id: number): Promise<void> {
    const review = await this.repo.findOne(id);
    if (!review) throw new NotFoundException();

    this.repo.delete(review);
  }
}
