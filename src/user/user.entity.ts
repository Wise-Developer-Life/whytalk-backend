import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Gender } from './user.type';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: false,
  })
  gender: Gender;

  @Column({ nullable: false })
  birthDate: Date;
}
