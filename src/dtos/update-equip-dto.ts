import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateEquipDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'cuon so tay', required: false })
  title: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 7, required: false })
  timeBorrow: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Van phong pham', required: false })
  category: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 100, required: false })
  price: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'mo ta san pham', required: false })
  description: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 10, required: false })
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, required: false })
  avaiQuantity?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: './imgs/depot/booknote.png', required: false })
  urlImg?: string;

  @IsOptional()
  @ApiProperty({ type: String, format: 'binary', required: false })
  file: Express.Multer.File;
}
