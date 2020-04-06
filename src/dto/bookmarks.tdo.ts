import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateBookmarkDto {
  @IsNumber()
  @IsNotEmpty()
  readonly roomId: number;
}
