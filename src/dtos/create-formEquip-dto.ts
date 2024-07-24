import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFormEquipDTO {
  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  dlReturnDate: Date;

  @IsDateString()
  @ApiProperty()
  @IsOptional()
  returnDate: Date;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ format: 'uuid' })
  equipId: string;
}
