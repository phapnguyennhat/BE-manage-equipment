import { Module } from '@nestjs/common';
import { CartItemController } from './cartItem.controller';
import { CartItemService } from 'src/services/cartItem.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from 'src/models/cartItem.entity';
import { UserService } from 'src/services/user.service';
import { EquipmentService } from 'src/services/equipment.service';
import { User } from 'src/models/user.entity';
import { Equipment } from 'src/models/equipment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, User, Equipment])],
  controllers: [CartItemController],
  providers: [CartItemService, UserService, EquipmentService],
})
export class CartItemModule {}
