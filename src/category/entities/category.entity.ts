import { Product } from "src/product/entities/product.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @CreateDateColumn()
  createAt: Timestamp;
  @UpdateDateColumn()
    updateAt: Timestamp;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

//   @ManyToOne(() => User, (user) => user.categories)
//   addedBy: User;

//   @OneToMany(() => Product, (prod) => prod.category)
//   products: Product[];
}
