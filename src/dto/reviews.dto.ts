import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReviewDto {
  // host
  @IsNumber()
  @IsNotEmpty()
  readonly roomId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly ratings: number;

  @IsString()
  @IsNotEmpty()
  readonly comments: string;
}
