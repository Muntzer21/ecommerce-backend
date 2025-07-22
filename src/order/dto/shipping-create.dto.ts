import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateShippingDto {
  @IsString()
  phone: string;
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsString()
  city: string;

  @IsString()
  postcode: string;

  @IsString()
  country: string;
}
