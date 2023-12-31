import { IsEmail, IsOptional, IsString, IsUrl, Length, ValidateNested } from 'class-validator';
import { Photo } from '../entities/photo.entity';
import { Type } from 'class-transformer';

export class CreateClientDTO {
  @Length(2, 25)
  firstName: string;

  @Length(2, 25)
  lastName: string;

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
