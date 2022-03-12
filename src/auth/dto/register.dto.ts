import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsOptional()
  fristName: string

  @IsString()
  @IsOptional()
  lastName: string
}