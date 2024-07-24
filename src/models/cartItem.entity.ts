import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Equipment } from './equipment.entity';

@Entity('cartItem')
export class CartItem {
  @Column({ default: 1 })
  quantity: number;

  @Column({ name: 'userId', primary: true })
  userId: string;

  @PrimaryColumn()
  equipId: string;

  @ManyToOne(() => User, (user) => user.cartItems, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => Equipment, (equip) => equip.cartItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'equipId' })
  equip: Equipment;
}
