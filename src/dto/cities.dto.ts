import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCityDto {
  @IsString()
  @IsNotEmpty()
  readonly value: string;
}

export class UpdateCityDto {
  @IsString()
  @IsNotEmpty()
  readonly value: string;
}
