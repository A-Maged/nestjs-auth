import { IsEmail, IsNotEmpty, IsString, Length, Matches, Min, MinLength } from 'class-validator';

export class RegisterClientDTO {
  @Length(2, 25)
  @IsNotEmpty()
  firstName: string;

  @Length(2, 25)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
