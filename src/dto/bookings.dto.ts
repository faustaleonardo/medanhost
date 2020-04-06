import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsNumber()
  @IsNotEmpty()
  readonly roomId: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  readonly checkInDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  readonly checkOutDate: Date;

  @IsNumber()
  @IsNotEmpty()
  readonly guests: number;

  @IsNumber()
  @IsNotEmpty()
  readonly price: number;
}
