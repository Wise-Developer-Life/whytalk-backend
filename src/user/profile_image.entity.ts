import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ProfileImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  order: number;

  @Column('varchar', { length: 255, nullable: true, unique: true })
  url: string;

  @ManyToOne(() => User, (user) => user.profileImages)
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;
}
