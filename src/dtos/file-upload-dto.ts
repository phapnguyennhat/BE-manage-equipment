import { ApiProperty } from '@nestjs/swagger';
export class UploadDTO {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
