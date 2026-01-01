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
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
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

