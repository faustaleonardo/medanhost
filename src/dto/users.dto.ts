export class CreateUserDto {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export class UpdateUserDto {
  firstName: string;
  lastName: string;
}
