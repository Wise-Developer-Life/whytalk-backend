import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserProfile } from './profile.entity';

@Entity()
export class ProfileImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  order: number;

  @Column('varchar', { length: 255, nullable: true, unique: true })
  url: string;

  @ManyToOne(() => UserProfile, (userProfile) => userProfile.profileImages, {
    orphanedRowAction: 'delete',
  })
  userProfile: UserProfile;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;
}
