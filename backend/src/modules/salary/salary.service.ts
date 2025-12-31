import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalaryRecord } from './entities/salary-record.entity';

@Injectable()
export class SalaryService {
  constructor(
    @InjectRepository(SalaryRecord)
    private salaryRepository: Repository<SalaryRecord>,
  ) {}

  async create(salaryData: {
    userId: string;
    month: string;
    baseSalary: number;
    allowances?: number;
    deductions?: number;
    recordedByUserId?: string;
  }) {
    try {
      // Validate month format (YYYY-MM)
      const monthRegex = /^\d{4}-\d{2}$/;
      if (!monthRegex.test(salaryData.month)) {
        throw new BadRequestException('Invalid month format. Use YYYY-MM');
      }

      // Check if salary record already exists for this user and month
      const existing = await this.salaryRepository.findOne({
        where: {
          userId: salaryData.userId,
          month: salaryData.month,
        },
      });

      if (existing) {
        throw new ConflictException('Salary record already exists for this user and month');
      }

      // Calculate net salary
      const netSalary =
        Number(salaryData.baseSalary || 0) +
        Number(salaryData.allowances || 0) -
        Number(salaryData.deductions || 0);

      // Create salary record
      const salaryRecord = this.salaryRepository.create({
        userId: salaryData.userId,
        month: salaryData.month,
        baseSalary: salaryData.baseSalary,
        allowances: salaryData.allowances || 0,
        deductions: salaryData.deductions || 0,
        netSalary: netSalary,
        recordedByUserId: salaryData.recordedByUserId || null,
      });

      return await this.salaryRepository.save(salaryRecord);
    } catch (error) {
      console.error('Error in salary create:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.salaryRepository.find({
        relations: ['user', 'recordedBy'],
        order: {
          month: 'DESC',
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      console.error('Error in salary findAll:', error);
      throw error;
    }
  }

  async findByUser(userId: string) {
    try {
      return await this.salaryRepository.find({
        where: { userId },
        relations: ['user', 'recordedBy'],
        order: {
          month: 'DESC',
        },
      });
    } catch (error) {
      console.error('Error in salary findByUser:', error);
      throw error;
    }
  }
}

