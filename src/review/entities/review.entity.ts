import { Product } from 'src/product/entities/product.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn()
  review_id: number;
  @Column({ type: 'int', default: 0 })
  rating: number;
  @Column()
  comment: string;
  @CreateDateColumn()
  created_at: Timestamp;
  @UpdateDateColumn()
  updated_at: Timestamp;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;

  // constructor(partial: Partial<Review>) {
  //     Object.assign(this, partial);
  // }
}
