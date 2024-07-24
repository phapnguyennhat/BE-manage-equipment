import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipment } from 'src/models/equipment.entity';
import { EquipmentService } from 'src/services/equipment.service';
import { EquipmentController } from './equipment.controller';
import { CloudinaryService } from 'src/services/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Equipment])],
  providers: [EquipmentService, CloudinaryService],
  controllers: [EquipmentController],
})
export class EquipmentModule {}
