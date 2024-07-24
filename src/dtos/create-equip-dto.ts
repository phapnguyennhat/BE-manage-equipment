import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Multer } from 'multer';

export class CreateEquipDTO {
  // @IsString()
  // @IsOptional()
  // @ApiProperty({ description: 'id Optional or provide uuid', example: 'uuid' })
  // id?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'SỔ tay' })
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'unit day', example: 7, type: Number })
  timeBorrow: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Văn phòng phẩm' })
  category: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 100, type: Number })
  price: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Mo ta cho so tay' })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 10, type: Number })
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 6, type: Number })
  avaiQuantity: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: './imgs/Depot/notebook.png', required: false })
  urlImg: string;

  // @ApiProperty({ type: 'string', format: 'binary' })
  // file: Express.Multer.File;

  @IsNotEmpty()
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  formEquipments;
}
