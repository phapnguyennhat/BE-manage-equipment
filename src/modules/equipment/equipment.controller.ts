import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request, query } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
// import { multerConfig } from 'src/config/multer-config';
import { CreateEquipDTO } from 'src/dtos/create-equip-dto';
import { UpdateEquipDTO } from 'src/dtos/update-equip-dto';
import { JwtAdminGuard } from 'src/guard/jwt-admin.guard';
import { EquipmentService } from 'src/services/equipment.service';
import { UpdateResult } from 'typeorm';
import { UploadDTO } from 'src/dtos/file-upload-dto';
import { multerConfig } from 'src/config/multer-config';
import { identity } from 'rxjs';
import { CloudinaryService } from 'src/services/cloudinary.service';
import { error } from 'console';
import { Equipment } from 'src/models/equipment.entity';
import { JwtAuthGuard } from 'src/guard/jwt.guard';

@Controller('equipment')
@ApiTags('equipment')
export class EquipmentController {
  constructor(
    private readonly equipService: EquipmentService,
    private readonly cloudinary: CloudinaryService,
  ) {}
  @Post()
  @UseGuards(JwtAdminGuard)
  @ApiBody({ type: CreateEquipDTO })
  @ApiResponse({
    status: 201,
    description: 'it will give you the Object Equip',
  })
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('JWT-auth')
  create(
    @Body() equipDTO: CreateEquipDTO,
    // @UploadedFile(
    //   new ParseFilePipe({
    //     validators: [new FileTypeValidator({ fileType: 'image' })],
    //   }),
    // )
    // file: Express.Multer.File,
  ) {
    return this.equipService.create(equipDTO);
  }

  @Put(':id')
  @UseGuards(JwtAdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: UpdateEquipDTO })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateEquipDTO: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image' })],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ): Promise<Equipment> {
    const data: UpdateEquipDTO = updateEquipDTO;
    // console.log(data);
    // return this.equipService.update(id, updateEquipDTO);
    if (file) {
      try {
        const result = await this.cloudinary.uploadFile(file, 'test');

        data.urlImg = result.secure_url;
        console.log(result.public_id);
      } catch (error: any) {
        console.log(error);
        return error;
      }
    } else {
      delete data.file;
    }
    return this.equipService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', example: 'uuid' })
  async delete(@Param('id') id: string) {
    return this.equipService.delete(id);
  }

  @Post(':id')
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadDTO })
  @ApiParam({ name: 'id' })
  async upload(
    @Param('id') equipId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image' })],
      }),
    )
    file: Express.Multer.File,
    // @Req() req,
  ) {
    // console.log(file);
    // const fileUrl: string = `${req.protocol}://${req.get('host')}/files/${file.filename}`;
    try {
      const result = await this.cloudinary.uploadFile(file, 'test');
      const update = new UpdateEquipDTO();
      update.urlImg = result.secure_url;
      await this.equipService.update(equipId, update);
      const equip = await this.equipService.findById(equipId);
      return equip;
    } catch (err) {
      console.log(error);
    }
  }

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'cate', required: false })
  @ApiQuery({ name: 'timefrom', required: false })
  @ApiQuery({ name: 'timeto', required: false })
  async findAll(
    @Query('page') page: number = 1,
    @Query('status') status: string = undefined,
    @Query('cate') cate: string = undefined,
    @Query('timefrom') timefrom: number = 0,
    @Query('timeto') timeto: number = 100,
  ) {
    return this.equipService.findAll(page, status, cate, timefrom, timeto);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.equipService.getById(id);
  }
}
