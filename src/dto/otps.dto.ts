import { IsString, IsNotEmpty } from 'class-validator';

export class CreateOtpDto {
  @IsString()
  @IsNotEmpty()
  readonly email: string;
}
