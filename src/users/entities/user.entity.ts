import { IsEmail, Length } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

enum UserRole {
  client = 'client',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Length(2, 25)
  @Column({ length: 25 })
  firstName: string;

  @Length(2, 25)
  @Column({ length: 25 })
  lastName: string;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ enum: UserRole })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
