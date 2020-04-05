import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePriceDto {
  @IsNumber()
  @IsNotEmpty()
  readonly roomId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly guests: number;

  @IsNumber()
  @IsNotEmpty()
  readonly price: number;
}

export class UpdatePriceDto {
  @IsNumber()
  @IsNotEmpty()
  readonly roomId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly guests: number;

  @IsNumber()
  @IsNotEmpty()
  readonly price: number;
}
