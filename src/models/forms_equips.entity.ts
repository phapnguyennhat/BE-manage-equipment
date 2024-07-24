import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Form } from './form.entity';
import { Equipment } from './equipment.entity';

@Entity('forms_equips')
export class FormEquipment {
  @Column({ type: 'date', nullable: true })
  dlReturnDate: Date;

  @Column({ nullable: true, type: 'date' })
  returnDate: Date;

  @Column({ name: 'formId', primary: true })
  formId: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Form, (form) => form.formEquipments, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'formId' })
  form: Form;

  @Column({ name: 'equipId', primary: true })
  equipId: string;

  @ManyToOne(() => Equipment, (equipment) => equipment.formEquipments, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'equipId' })
  equipment: Equipment;
}
