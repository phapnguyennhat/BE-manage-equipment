import { Type } from 'class-transformer';
import { method, status } from './../models/form.entity';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import getToday from 'src/functions/getToday';
import { CreateEquipDTO } from 'src/dtos/create-equip-dto';
import { CreateFormEquipDTO } from 'src/dtos/create-formEquip-dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFormParams {
  @IsOptional()
  @IsDateString()
  @ApiProperty()
  approveDate: Date;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  borrowDate: Date;

  @IsEnum(status)
  @IsOptional()
  @ApiProperty({ examples: ['approved', 'notApproved', 'reject'] })
  status: status;

  @IsEnum(method)
  @ApiProperty()
  method: method;

  // @IsNotEmpty()
  // @IsString()
  // @IsOptional()
  // @ApiProperty({ format: 'uuid', required: false })
  // userId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ format: 'uuid', required: false })
  userId_approve: string;

  @IsNotEmpty()
  @IsArray()
  @Type(() => CreateFormEquipDTO)
  @ValidateNested({ each: true })
  @ApiProperty({ type: CreateFormEquipDTO, isArray: true })
  formEquipments: CreateFormEquipDTO[];
}
