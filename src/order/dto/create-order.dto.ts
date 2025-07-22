import { IsNotEmpty, ValidateNested } from "class-validator";
import { OrderProuctsDto } from "./order-products.dto";
import { CreateShippingDto } from "./shipping-create.dto";
import { Type } from "class-transformer";

export class CreateOrderDto {
  @Type(() => CreateShippingDto)
  @ValidateNested()
  @IsNotEmpty() // Add this if the shipping DTO itself is mandatory (not just its internal properties)
  createShipping: CreateShippingDto;
  @Type(() => OrderProuctsDto)
  @ValidateNested({ each: true }) // <--- Add { each: true } for array validation
  @IsNotEmpty() // Add this if the orderedProducts array must not be empty
  orderedProducts: OrderProuctsDto[];
}
