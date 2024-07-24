import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FormEquipment } from './forms_equips.entity';
import { Form } from './form.entity';
import { CartItem } from './cartItem.entity';

@Entity('equipment')
export class Equipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  timeBorrow: number;

  @Column()
  category: string;

  @Column()
  price: number;

  @Column({ type: 'text' })
  description: string;

  @Column()
  quantity: number;

  @Column()
  avaiQuantity: number;

  @Column({ nullable: true })
  urlImg: string;

  @OneToMany(() => FormEquipment, (formEquipment) => formEquipment.equipment, {
    nullable: true,
  })
  formEquipments: FormEquipment[];

  @OneToOne(() => CartItem, (cartItem) => cartItem.equip)
  cartItem: CartItem;
}
