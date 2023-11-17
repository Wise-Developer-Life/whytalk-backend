import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfileImage } from './profile_image.entity';
import { User } from './user.entity';
import { Gender } from './user.type';

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: false,
  })
  gender: Gender;

  @Column({
    nullable: false,
  })
  birthDate: Date;

  @Column({
    nullable: true,
  })
  bio: string;

  @OneToMany(() => ProfileImage, (profileImage) => profileImage.userProfile, {
    cascade: true,
    lazy: true,
  })
  profileImages: Promise<ProfileImage[]>;

  getAge(): number {
    if (!this.birthDate) {
      throw new Error('Birth date is not set');
    }

    const now = new Date();
    const age = now.getFullYear() - this.birthDate.getFullYear();
    if (
      now.getMonth() < this.birthDate.getMonth() ||
      (now.getMonth() === this.birthDate.getMonth() &&
        now.getDate() < this.birthDate.getDate())
    ) {
      return age - 1;
    }
    return age;
  }

  async getProfileImages(sorted = false) {
    const images = (await this.profileImages) ?? [];
    if (sorted) {
      images.sort((a, b) => a.order - b.order);
    }
    return images;
  }
}
