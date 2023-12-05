import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsUrl } from 'class-validator';
import { Client } from './client.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @IsUrl()
  @Column()
  url: string;

  @ManyToOne(() => Client, (client) => client.photos, {
    onDelete: 'CASCADE',
  })
  client?: Client[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt?: Date;
}
