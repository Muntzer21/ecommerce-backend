import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { OrderStatus } from "../enums/order-status";
import { User } from "src/user/entities/user.entity";
import { Shipping } from "./shipping.entity";
import { OrdersProducts } from "./order.products.entity";

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;
  @CreateDateColumn()
  orderAt: Timestamp;
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: string;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 }) // Total amount of the order
  totalAmount: number;
  @Column({ nullable: true })
  shippedAt: Date;
  @Column({ nullable: true })
  deliveredAt: Date;
  @Column({nullable:true})
  added_by : number
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToOne(() => Shipping, (ship) => ship.order, { cascade: true })
  @JoinColumn()
  shipping_address: Shipping;

  @OneToMany(() => OrdersProducts, (op) => op.order, { cascade: true })
  products: OrdersProducts[];
}
