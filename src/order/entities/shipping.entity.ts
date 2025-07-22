import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity('shippings')
export class Shipping {
  @PrimaryGeneratedColumn()
  shipping_id: number;
  @Column()
  phone: string;
  @Column({ default: ' ' })
  name: string;
  @Column()
  address: string;
  @Column()
  city: string;

  @Column()
  postcode: string;

  @Column()
  country: string;
  @OneToOne(() => Order, (order) => order.shipping_address)
  order: Order;
}
