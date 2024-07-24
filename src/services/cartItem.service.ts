import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDTO } from 'src/dtos/create-cartItem-dto';
import { EquipmentService } from './equipment.service';
import { UserService } from './user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/models/cartItem.entity';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateCartDTO } from 'src/dtos/update-cartItem-dto';
import { UpdateItem } from 'src/dtos/update-cartAll-dto';
import dataSource from 'db/data-source';

@Injectable()
export class CartItemService {
  constructor(
    // private readonly equipService: EquipmentService,
    // private readonly userService: UserService,
    @InjectRepository(CartItem)
    private readonly repoCartItem: Repository<CartItem>,
    private dataSource: DataSource,
  ) {}
  async create(createCartDTO: CreateCartDTO): Promise<CartItem> {
    const item = await this.repoCartItem.findOne({
      where: {
        userId: createCartDTO.userId,
        equipId: createCartDTO.equipId,
      },
      relations: { equip: true },
    });
    if (item && !createCartDTO.quantity) {
      item.quantity =
        item.quantity + 1 <= item.equip.avaiQuantity
          ? item.quantity + 1
          : item.equip.avaiQuantity;

      console.log({
        avaiquantity: item.equip.avaiQuantity,
        quantity: item.quantity,
      });
      return this.repoCartItem.save(item);
    } else if (item && createCartDTO.quantity) {
      item.quantity = createCartDTO.quantity;
      return this.repoCartItem.save(item);
    }
    const newCartItem = this.repoCartItem.create(createCartDTO);
    return this.repoCartItem.save(newCartItem);
  }
  async update(
    userId: string,
    equipId: string,
    updateCartDTO: UpdateCartDTO,
  ): Promise<CartItem> {
    const cartItem = await this.repoCartItem.findOne({
      where: { userId: userId, equipId: equipId },
      relations: { equip: true },
    });
    if (!cartItem) {
      throw new NotFoundException('Cart Item not found');
    }
    Object.assign(cartItem, updateCartDTO);
    await this.repoCartItem.save(cartItem);
    return cartItem;
  }

  async updateAll(userId: string, data: UpdateItem[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      for (const item of data) {
        await queryRunner.manager.update(
          CartItem,
          { userId: userId, equipId: item.equipId },
          { quantity: item.quantity },
        );
      }
      await queryRunner.commitTransaction();
      return { message: 'update successfully' };
    } catch (err) {
      console.log('ROLLBACK UPDATE');
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findbyUserId(
    userId: string,
  ): Promise<{ data: CartItem[]; count: number; total: number }> {
    // return this.repoCartItem.findBy({ userId: userId });
    const [data, count] = await this.repoCartItem.findAndCount({
      where: { userId: userId },
      relations: { equip: true },
    });
    const total = data.reduce(
      (res, item) => res + item.equip.price * item.quantity,
      0,
    );
    return { data, count, total };
  }

  async delete(userid: string, equipId: string): Promise<DeleteResult> {
    return this.repoCartItem.delete({ userId: userid, equipId: equipId });
  }

  async deleteAll(userid: string): Promise<DeleteResult> {
    return this.repoCartItem.delete({ userId: userid });
  }
}
