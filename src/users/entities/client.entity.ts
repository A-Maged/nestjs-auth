import { Column, Entity, OneToMany } from 'typeorm';
import { IsUrl } from 'class-validator';
import { User } from './user.entity';
import { Photo } from './photo.entity';

@Entity()
export class Client extends User {
  @IsUrl()
  // @Todo: replace default url
  @Column({ default: 'http://default-url' })
  avatar: string;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];
}
