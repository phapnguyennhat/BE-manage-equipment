import { status } from 'src/models/form.entity';
import { UpdateEquipDTO } from './../dtos/update-equip-dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CreateEquipDTO } from 'src/dtos/create-equip-dto';
import { Equipment } from 'src/models/equipment.entity';
import {
  Between,
  DeleteResult,
  FindOptionsWhere,
  In,
  MoreThan,
  Repository,
  UpdateResult,
} from 'typeorm';
import { isArray } from 'class-validator';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment) private RepoEquipment: Repository<Equipment>,
  ) {}

  async create(equipDTO: CreateEquipDTO): Promise<Equipment> {
    // console.log(equipDTO);
    return this.RepoEquipment.save(equipDTO);
  }

  async update(id: string, updateEquipDTO: UpdateEquipDTO): Promise<Equipment> {
    // console.log(updateEquipDTO);
    const equip = await this.RepoEquipment.findOneBy({ id: id });
    if (!equip) {
      throw new NotFoundException('equip not found');
    }
    Object.assign(equip, updateEquipDTO);
    return this.RepoEquipment.save(equip);
  }
  async findById(id: string): Promise<Equipment> {
    return this.RepoEquipment.findOneBy({ id: id });
  }
  async delete(id: string): Promise<DeleteResult> {
    return this.RepoEquipment.delete({ id: id });
  }

  async findAll(
    page: number,
    status: string,
    cate: string,
    timefrom: number,
    timeto: number,
  ): Promise<{ data: Equipment[]; count: number }> {
    const where: FindOptionsWhere<Equipment> = {};
    where.timeBorrow = Between(timefrom, timeto);

    if (cate) {
      where.category = cate;
    }
    if (status == 'available') {
      where.avaiQuantity = MoreThan(0);
    } else if (status === 'soldout') {
      where.avaiQuantity = 0;
    }

    const [data, count] = await this.RepoEquipment.findAndCount({
      skip: (page - 1) * 8,
      take: 8,
      where: where,
    });

    return { data, count };
  }

  async getById(id: string): Promise<Equipment> {
    return this.RepoEquipment.findOneBy({ id: id });
  }
}
