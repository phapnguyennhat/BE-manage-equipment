import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserModule } from './modules/user/user.module';

import { EquipmentModule } from './modules/equipment/equipment.module';
import { FormModule } from './modules/form/form.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { typeOrmAsyncConfig } from '../db/data-source';
import { CartItemModule } from './modules/cartItem/cartItem.module';
import { validate } from 'env.validations';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ConfigModule.forRoot({
      envFilePath: ['.development.env'],
      isGlobal: true,
      load: [configuration],
      validate: validate,
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', '..', 'public'),
    // }),
    EquipmentModule,
    FormModule,
    AuthModule,
    UserModule,
    CartItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    console.log(dataSource.driver.database);
  }
}
