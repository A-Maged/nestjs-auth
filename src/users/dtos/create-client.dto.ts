import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateClientDTO {
  @Length(2, 25)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
