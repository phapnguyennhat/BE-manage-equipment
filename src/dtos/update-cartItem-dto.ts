import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateCartDTO {
  // @IsString()
  // @IsOptional()
  // userId: string;
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  quantity: number;

  //   @IsString()
  //   @IsOptional()
  //   equipId: string;
}
