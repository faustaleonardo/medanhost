import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  Req,
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

  async create(dto: CreateReviewDto, @Req() req): Promise<Review> {
    const userId = req.user.id;
    const { roomId, ratings, comments } = dto;

    // update existing review
    const existingReview = await this.findOneByRoomId(roomId, req);
    if (existingReview) return this.update(existingReview.id, {ratings, comments});

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
    const review = await this.repo.findOne(id, {
      relations: ['user', 'room'],
    });
    if (!review) throw new NotFoundException();

    return review;
  }

  async findOneByRoomId(roomId: number, @Req() req): Promise<Review> {
    const userId = req.user.id;

    return await this.repo.createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user', 'user.id = :userId', {userId})
      .leftJoinAndSelect('review.room', 'room', 'room.id = :roomId', {roomId})
      .getOne();
  }


  async update(id: number, data: any): Promise<Review> {
    const { ratings, comments } = data;

    const review = await this.repo.findOne(id);
    if (!review) throw new NotFoundException();

    if (ratings !== undefined) review.ratings = ratings;
    if (comments !== undefined) review.comments = comments;

    review.updatedAt = new Date();

    return await this.repo.save(review);
  }

  async delete(id: number): Promise<void> {
    const review = await this.repo.findOne(id);
    if (!review) throw new NotFoundException();

    this.repo.delete(review);
  }
}
