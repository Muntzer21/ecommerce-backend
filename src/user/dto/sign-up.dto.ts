import { IsString, Length, IsEmail} from "class-validator";

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(4, 10, { message: 'Username must be between 4 and 10 characters' })
  username: string;

  @IsString()
  @IsString({ message: 'Password must be a string' })
  @Length(4, 20, { message: 'Password must be between 4 and 20 characters' })
  password: string;
}