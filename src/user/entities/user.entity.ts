import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { UserType } from "../../utils/user-type";
import { Review } from "src/review/entities/review.entity";
import { Order } from "src/order/entities/order.entity";

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

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[]
}
