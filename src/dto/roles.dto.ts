import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  value: string;
}

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  value: string;
}
