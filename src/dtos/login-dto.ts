import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Provide the username of the user',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}
