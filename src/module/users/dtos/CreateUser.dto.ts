import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean, IsDate, IsNotEmpty } from 'class-validator';
// import { UserRole } from 'src/typeorm/enums';
import { UserRole } from '../../../typeorm/enums';
// import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsOptional()
  @IsNotEmpty()
  id?: number;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsDate()
  terms_agreed_at?: Date;

  @IsOptional()
  @IsString()
  photo_url?: string;

  @IsOptional()
  @IsString()
  verified?: string;

  @IsOptional()
  @IsString()
  verification_token?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  reset_password_token?: string;

  @IsOptional()
  @IsDate()
  reset_password_sent_at?: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDate()
  created_at?: Date;

  @IsOptional()
  @IsDate()
  updated_at?: Date;
}
