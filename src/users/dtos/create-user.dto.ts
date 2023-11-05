import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDTO {
  @Length(2, 25)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
