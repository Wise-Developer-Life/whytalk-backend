import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserProfile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @OneToOne(() => UserProfile, (profile) => profile.user, {
    lazy: true,
    cascade: true,
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Promise<UserProfile>;
}
