import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { role } from 'src/models/user.entity';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  mssv: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstname: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @ApiProperty({ format: 'email' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @IsEnum(role)
  @ApiProperty({ examples: ['student', 'admin'] })
  @IsOptional()
  role: role;
}
