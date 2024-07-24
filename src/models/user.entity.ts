import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Form } from './form.entity';
import { Exclude } from 'class-transformer';
import { CartItem } from './cartItem.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum role {
  STUDENT = 'student',
  ADMIN = 'admin',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '2212495',
    description: 'Provide mssv of user',
  })
  @Column({ nullable: true, unique: true })
  mssv?: string;

  @ApiProperty({
    example: 'Nguyen',
    description: 'Provide the first name of user',
  })
  @Column()
  firstname: string;

  @ApiProperty({
    example: 'Phap',
    description: 'provide the lastname of the user',
  })
  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  // @Column()
  // phone: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: role, default: role.STUDENT })
  role: role;

  @OneToMany(() => Form, (form) => form.user)
  formRegisters: Form[];

  @OneToMany(() => Form, (form) => form.userApproved)
  formApproveds: Form[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems: CartItem[];
}
