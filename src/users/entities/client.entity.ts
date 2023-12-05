import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { IsUrl } from 'class-validator';
import { User } from './user.entity';
import { Photo } from './photo.entity';

@Entity()
export class Client extends User {
  @IsUrl()
  @Column({ default: 'https://placehold.co/200x200' })
  avatar?: string;

  @OneToMany(() => Photo, (photo) => photo.client, { cascade: true })
  photos?: Photo[];
}
