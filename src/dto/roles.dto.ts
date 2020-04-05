import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  readonly value: string;
}

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  readonly value: string;
}
