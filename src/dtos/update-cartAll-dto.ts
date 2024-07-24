import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateItem {
  @ApiProperty()
  quantity: number;
  @ApiProperty()
  equipId: string;
}
