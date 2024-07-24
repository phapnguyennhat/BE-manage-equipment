import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCartParams {
  // @IsOptional()
  // @IsString()
  // @ApiProperty({ format: 'uuid' })
  // userId: string;
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  quantity: number = 1;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ format: 'uuid' })
  equipId: string;
}
