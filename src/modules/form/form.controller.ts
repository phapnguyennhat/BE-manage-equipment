import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { use } from 'passport';
import { NotFoundError } from 'rxjs';
import { CreateFormDTO } from 'src/dtos/create-form-dto';
import { UpdateFormEquipDTO } from 'src/dtos/update-equip-borrow';
import { UpdateFormDTO } from 'src/dtos/update-form-dto';
import addDaysToDate from 'src/functions/addDays';
import getToday from 'src/functions/getToday';
import { JwtAdminGuard } from 'src/guard/jwt-admin.guard';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { Form, status } from 'src/models/form.entity';
import { User } from 'src/models/user.entity';
import { CreateFormParams } from 'src/params/create-form-params';
import { FormService } from 'src/services/form.service';
import { UserService } from 'src/services/user.service';
import { PayLoadType } from 'src/types/payLoad.type';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('form')
@ApiTags('form')
export class FormController {
  constructor(
    private formService: FormService,
    private userService: UserService,
  ) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: CreateFormParams })
  async create(@Req() req, @Body() formDTO: CreateFormParams): Promise<Form> {
    // formDTO.userId = formDTO.userId ? formDTO.userId : req.user.userId;
    const form: CreateFormDTO = { ...formDTO, userId: req.user.userId };
    return this.formService.create(form);
  }

  // @Put(':id')
  // @ApiBearerAuth('JWT-auth')
  // @UseGuards(JwtAuthGuard)
  // async update(@Param('id') id: string, @Body() updateFormDTO: UpdateFormDTO) {
  //   return this.formService.update(id, updateFormDTO);
  // }
  @Put(':id/status')
  @UseGuards(JwtAdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiBody({})
  async updateStatus(
    @Req() req,
    @Param('id') id: string,
    @Body() data: { status: status },
  ) {
    const formbyId: Form = await this.formService.findOne(id);
    if (formbyId.status !== status.NOTAPPROVED) {
      throw new ConflictException('form đã duyệt rồi');
    }
    const updateForm = new UpdateFormDTO();
    updateForm.approveDate = getToday();
    updateForm.status = data.status;

    const user = await this.userService.findById(req.user.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    updateForm.userId_approve = user.id;

    const equipBorrows: UpdateFormEquipDTO[] = formbyId.formEquipments.map(
      (formEquip) => {
        const equipBorrow = new UpdateFormEquipDTO();
        equipBorrow.dlReturnDate = addDaysToDate(
          getToday(),
          formEquip.equipment.timeBorrow,
        );
        equipBorrow.equipId = formEquip.equipId;
        return equipBorrow;
      },
    );
    updateForm.formEquipments = equipBorrows;

    return this.formService.update(id, updateForm);
  }
  @Put(':idForm/:idEquip/return')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAdminGuard)
  async returnEquip(
    @Param('idForm') formId: string,
    @Param('idEquip') EquipId: string,
  ) {
    return this.formService.returnEquip(formId, EquipId);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false })
  @ApiQuery({ name: 'mssv', required: false })
  async findAll(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'borrowDate',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query('mssv') mssv: string,
  ) {
    return this.formService.findAll(
      page,
      limit,
      sortBy,
      sortOrder,
      req.user.role,
      req.user.userId,
      mssv,
    );
  }

  // @Get(':id')
  // @ApiBearerAuth('JWT-auth')
  // async findOne(@Param('id') id: string) {
  //   this.formService.findOne(id);
  // }
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAdminGuard)
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.formService.delete(id);
  }
}
