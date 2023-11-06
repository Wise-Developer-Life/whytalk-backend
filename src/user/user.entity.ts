import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Gender } from './user.type';

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
  birthDate: Date;

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
}
