import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class OrderProuctsDto {
  @IsNotEmpty({ message: 'product id can not be empty' })
  product_id: number;
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'price should be number & max decimal precission 2' },
  )
  // @IsPositive()
  // product_unit_price: number;

  @IsNumber()
  @IsPositive()
  product_quantity: number;
}
