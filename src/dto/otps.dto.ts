import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOtpDto {
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsNumber()
  @IsNotEmpty()
  readonly roleId: number;
}

export class VerifyOtpDto {
  @IsNumber()
  @IsNotEmpty()
  readonly code: number;
}
