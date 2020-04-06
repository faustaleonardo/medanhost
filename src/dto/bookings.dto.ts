import { IsNotEmpty, IsNumber, IsDate, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoomDto {
  @IsNumber()
  @IsNotEmpty()
  readonly roomId: number;

  // guest
  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;

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

  @IsBoolean()
  @IsNotEmpty()
  readonly statusPayment: boolean;

  @IsBoolean()
  @IsNotEmpty()
  readonly active: boolean;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  readonly expiredDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  readonly createdAt: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  readonly updatedAt: Date;
}
