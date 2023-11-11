import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Gender } from './user.type';
import { ProfileImage } from './profile_image.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @Column({
    nullable: true,
  })
  bio: string;

  @Column({
    nullable: true,
  })
  birthDate: Date;

  @OneToMany(() => ProfileImage, (profileImage) => profileImage.user, {
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
