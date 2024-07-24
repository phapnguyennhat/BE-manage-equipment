import { Module } from '@nestjs/common';
import { FormService } from 'src/services/form.service';
import { FormController } from './form.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from 'src/models/form.entity';
import { User } from 'src/models/user.entity';
import { FormEquipment } from 'src/models/forms_equips.entity';
import { Equipment } from 'src/models/equipment.entity';
import { UserService } from 'src/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Form, User, FormEquipment, Equipment])],
  providers: [FormService, UserService],
  controllers: [FormController],
})
export class FormModule {}
