import { IsEmail, IsString, Length } from "class-validator";

export class SignInDto {

    @IsEmail({},{ message: 'Invalid email format' })
   email: string;

   @IsString({ message: 'Password must be a string' })
   @Length(4, 20, { message: 'Password must be between 4 and 20 characters' })
   password: string;
}