import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  price: number;
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  stock: number;

  @IsNumber()
  @ApiProperty()
  category_id: number;
}
