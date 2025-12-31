import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { Co2Module } from './modules/co2/co2.module';
import { TemperatureModule } from './modules/temperature/temperature.module';
import { AiModule } from './modules/ai/ai.module';
import { DevicesModule } from './modules/devices/devices.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { PostsModule } from './modules/posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'sukri_vineyard',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Disabled - using existing database schema
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    UsersModule,
    AttendanceModule,
    InventoryModule,
    VendorsModule,
    Co2Module,
    TemperatureModule,
    AiModule,
    DevicesModule,
    TasksModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

