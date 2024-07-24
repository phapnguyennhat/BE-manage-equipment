import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateFormEquipDTO {
  @IsDateString()
  @IsOptional()
  dlReturnDate: Date;

  @IsDateString()
  @IsOptional()
  returnDate: Date;

  @IsNumber()
  @IsOptional()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  equipId: string;
}
