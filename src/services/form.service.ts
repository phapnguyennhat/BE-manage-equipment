import { FormEquipment } from '../models/forms_equips.entity';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { of, take, throwError } from 'rxjs';
import { CreateFormDTO } from 'src/dtos/create-form-dto';
import { UpdateFormDTO } from 'src/dtos/update-form-dto';
import getToday from 'src/functions/getToday';
import { Equipment } from 'src/models/equipment.entity';
import { Form, status } from 'src/models/form.entity';
import { role, User } from 'src/models/user.entity';
import {
  DataSource,
  DeleteResult,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form) private readonly repoForm: Repository<Form>,
    @InjectRepository(User) private repoUser: Repository<User>,
    @InjectRepository(FormEquipment)
    private repoFormEquip: Repository<FormEquipment>,
    @InjectRepository(Equipment) private repoEquipment: Repository<Equipment>,
    private dataSource: DataSource,
  ) {}

  async create(formDTO: CreateFormDTO): Promise<Form> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const newForm = this.repoForm.create(formDTO);
      const savedForm = await queryRunner.manager.save(Form, newForm);
      for (const equipBorrow of formDTO.formEquipments) {
        const formEquip = this.repoFormEquip.create(equipBorrow);
        formEquip.form = savedForm;
        await queryRunner.manager.save(FormEquipment, formEquip);
      }
      await queryRunner.commitTransaction();
      return savedForm;
    } catch (error) {
      console.log('ROLLBACK CREATE FORM');
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, formUpdateDTO: UpdateFormDTO) {
    // console.log(formUpdateDTO);
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const formById = await queryRunner.manager.findOneBy(Form, { id: id });
      if (!formById) throw new NotFoundException('Form not found');
      Object.assign(formById, formUpdateDTO);
      delete formById.formEquipments;
      queryRunner.manager.update(Form, { id: id }, formById);

      for (const formEquip of formUpdateDTO.formEquipments) {
        const itemEquip = await queryRunner.manager.findOneBy(FormEquipment, {
          formId: id,
          equipId: formEquip.equipId,
        });
        Object.assign(itemEquip, formEquip);

        queryRunner.manager.save(FormEquipment, itemEquip);

        if (formUpdateDTO.status === status.APPROVED) {
          const equip = await queryRunner.manager.findOneBy(Equipment, {
            id: formEquip.equipId,
          });
          if (!equip) throw new NotFoundException('Equip not found');
          equip.avaiQuantity -= itemEquip.quantity;
          await queryRunner.manager.save(Equipment, equip);
        }
      }

      await queryRunner.commitTransaction();
      return { message: 'success' };
    } catch (error) {
      console.log('ROLLBACK TRANSACTION');
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: string): Promise<Form> {
    return this.repoForm.findOne({
      where: { id: id },
      relations: { formEquipments: { equipment: true } },
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'borrowDate',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    rol: role,
    userid: string,
    mssv: string,
  ): Promise<{ data: Form[]; count: number }> {
    if (rol === role.STUDENT) {
      const [data, count] = await this.repoForm.findAndCount({
        skip: (page - 1) * limit,
        where: { userId: userid },
        take: limit,
        order: {
          [sortBy]: sortOrder,
        },
        relations: {
          formEquipments: {
            equipment: true,
          },
        },
      });
      return { data, count };
    }
    if (rol === role.ADMIN) {
      const where: FindOptionsWhere<Form> = {};

      if (mssv) {
        const student = await this.repoUser.findOneBy({ mssv });
        where.userId = student.id;
      }
      const [data, count] = await this.repoForm.findAndCount({
        where: where,
        skip: (page - 1) * limit,
        take: limit,
        order: {
          [sortBy]: sortOrder,
        },
        relations: {
          formEquipments: {
            equipment: true,
          },
        },
      });
      return { data, count };
    }
  }

  async returnEquip(formId: string, equipId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const formEquip = await queryRunner.manager.findOneBy(FormEquipment, {
        formId,
        equipId,
      });
      if (!formEquip) throw new NotFoundException('Equip of Form not found');
      formEquip.returnDate = getToday();
      queryRunner.manager.save(FormEquipment, formEquip);

      const equip = await queryRunner.manager.findOneBy(Equipment, {
        id: equipId,
      });
      if (!equip) throw new NotFoundException('Equip not found');
      equip.avaiQuantity += formEquip.quantity;
      queryRunner.manager.save(Equipment, equip);

      await queryRunner.commitTransaction();
      return { message: 'success' };
    } catch (error) {
      console.log('ROLLBACK TRANSACTION');
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const findForm = await this.repoForm.findOne({
      where: { id: id },
      relations: { formEquipments: true },
    });

    if (!findForm) {
      throw new NotFoundException('Form not found');
    }
    if (findForm.status !== status.APPROVED) {
      return this.repoForm.delete({ id: id });
    } else {
      for (const equip of findForm.formEquipments) {
        if (!equip.returnDate) {
          // return yet?
          throw new ConflictException('Vật dụng chưa trả hết');
        }
      }
      return this.repoForm.delete({ id: id });
    }
  }
}
