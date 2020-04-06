import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreatePictureDto {
  @IsNumber()
  @IsNotEmpty()
  readonly roomId: number;

  @IsString()
  @IsNotEmpty()
  readonly path: string;
}
