import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "src/product/entities/product.entity";

@Entity({ name: 'orders_products' })
export class OrdersProducts {
  @PrimaryGeneratedColumn()
  orders_products_id: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  product_unit_price: number;
  @Column()
  product_quantity: number;
  @ManyToOne(() => Order, (order) => order.products)
  order: Order;
  @ManyToOne(() => Product, (prod) => prod.order_products)
  product: Product;
}
