import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateUserDto {
  @IsOptional()
  @ApiProperty()
  email: string;
  @IsOptional()
  @ApiProperty()
  password?: string;
  @IsOptional()
  @ApiProperty()
  username: string;
}
