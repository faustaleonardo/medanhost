import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTypeDto {
  @IsString()
  @IsNotEmpty()
  readonly value: string;
}

export class UpdateTypeDto {
  @IsString()
  @IsNotEmpty()
  readonly value: string;
}
