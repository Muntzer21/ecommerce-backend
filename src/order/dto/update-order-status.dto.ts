import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus } from '../enums/order-status';

export class UpdateOrderSatus {
  @IsNotEmpty()
  @IsString()
  @IsIn([OrderStatus.SHIPPED, OrderStatus.DELIVERED])
  status: OrderStatus;
}
