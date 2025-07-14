import { IsOptional } from "class-validator";

export class CreateUserDto {
  @IsOptional()
  email: string;
  @IsOptional()
  password?: string;
  @IsOptional()
  username: string;
}
