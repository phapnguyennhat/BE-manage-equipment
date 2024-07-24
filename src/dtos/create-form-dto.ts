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
import { CreateFormEquipDTO } from './create-formEquip-dto';
import getToday from 'src/functions/getToday';

export class CreateFormDTO {
  @IsOptional()
  @IsDateString()
  approveDate: Date;

  @IsOptional()
  @IsDateString()
  borrowDate: Date;

  @IsEnum(status)
  @IsOptional()
  status: status;

  @IsEnum(method)
  method: method;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  userId_approve: string;

  @IsNotEmpty()
  @IsArray()
  @Type(() => CreateFormEquipDTO)
  @ValidateNested({ each: true })
  formEquipments: CreateFormEquipDTO[];
}
