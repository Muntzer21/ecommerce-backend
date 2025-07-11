import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { UserType } from "../../utils/user-type";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;
  @Column()
  email: string;
  @Column({ unique: true })
  username: string;
  @Column({ select: false })
  password: string;
  @Column({ type: 'enum', enum: UserType, default: UserType.USER })
  roles: UserType;
  @CreateDateColumn()
  createAt: Timestamp;
  @UpdateDateColumn()
  updateAt: Timestamp;
}
