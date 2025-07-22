import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateShippingDto {
  @IsString()
  @ApiProperty()
  phone: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  address: string;
  @IsString()
  @ApiProperty()
  city: string;

  @IsString()
  @ApiProperty()
  postcode: string;

  @IsString()
  @ApiProperty()
  country: string;
}
