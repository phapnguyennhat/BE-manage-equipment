import { Type } from 'class-transformer';
import { status } from './../models/form.entity';
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
  isNumber,
} from 'class-validator';

import { CreateFormEquipDTO } from './create-formEquip-dto';
import { UpdateFormEquipDTO } from './update-equip-borrow';

export class UpdateFormDTO {
  @IsNumber()
  @IsOptional()
  id: string;

  @IsOptional()
  @IsDateString()
  approveDate: Date;

  @IsOptional()
  @IsDateString()
  borrowDate: Date;

  @IsEnum(status)
  @IsOptional()
  status: status;

  @IsString()
  @IsOptional()
  username: string;

  // @IsOptional()
  // @IsString()
  // username_approve: string;

  @IsOptional()
  @IsString()
  userId_approve: string;

  @IsOptional()
  @IsArray()
  @Type(() => UpdateFormEquipDTO)
  @ValidateNested({ each: true })
  formEquipments: UpdateFormEquipDTO[];
}
