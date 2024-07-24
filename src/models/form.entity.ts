import getToday from 'src/functions/getToday';
import {
  AfterRemove,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Equipment } from './equipment.entity';
import { FormEquipment } from './forms_equips.entity';
import { IsEnum } from 'class-validator';

export enum status {
  APPROVED = 'Duyệt',
  NOTAPPROVED = 'Chưa Duyệt',
  REJECT = 'Từ Chối',
}

export enum method {
  OFFICE = 'office',
  DESTINATION = 'destination',
}

@Entity('form')
export class Form {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', nullable: true })
  approveDate: Date;

  @Column({ type: 'date', nullable: false, default: getToday() })
  borrowDate: Date;

  @Column({ type: 'enum', enum: status, default: status.NOTAPPROVED })
  // @IsEnum(status)
  status: status;

  @Column({ name: 'userId' })
  userId: string;

  @Column({ type: 'enum', enum: method })
  // @IsEnum(method)
  method: method;

  @ManyToOne(() => User, (user) => user.formRegisters, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'userId_approve', nullable: true })
  userId_approve: string;

  @ManyToOne(() => User, (user) => user.formApproveds, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId_approve' })
  userApproved: User;

  @OneToMany(() => FormEquipment, (formEquipment) => formEquipment.form, {
    nullable: false,
  })
  formEquipments: FormEquipment[];
}
