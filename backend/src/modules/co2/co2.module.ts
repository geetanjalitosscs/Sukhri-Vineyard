import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Co2Controller } from './co2.controller';
import { Co2Service } from './co2.service';
import { Co2Barrel } from './entities/co2-barrel.entity';
import { Co2RefillHistory } from './entities/co2-refill-history.entity';
import { Task } from '../tasks/entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Co2Barrel, Co2RefillHistory, Task]),
  ],
  controllers: [Co2Controller],
  providers: [Co2Service],
})
export class Co2Module {}

