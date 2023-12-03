import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterClientDTO {
  @Length(2, 25)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
