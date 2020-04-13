import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  // host
  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly typeId: number;

  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @IsNumber()
  @IsNotEmpty()
  readonly bedrooms: number;

  @IsNumber()
  @IsNotEmpty()
  readonly beds: number;

  @IsNumber()
  @IsNotEmpty()
  readonly baths: number;

  @IsNumber()
  @IsNotEmpty()
  readonly guests: number;

  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
