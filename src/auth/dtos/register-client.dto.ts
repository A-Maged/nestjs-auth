import { IsEmail, IsOptional, IsString, IsUrl, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Photo } from 'src/users/entities/photo.entity';

export class RegisterClientDTO {
  @Length(2, 25)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @ValidateNested({ each: true })
  @Type(() => Photo)
  photos?: Photo[];
}
