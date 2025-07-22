import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  comment: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  rating: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  product_id: number;
}
