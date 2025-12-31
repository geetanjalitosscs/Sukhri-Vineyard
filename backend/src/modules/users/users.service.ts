import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'email', 'name', 'role', 'vineyardId', 'phone', 'status', 'createdByUserId', 'createdAt'],
      relations: ['createdBy'],
    });
  }

  async create(userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    vineyardId?: string;
    phone?: string;
    createdBy?: string;
  }): Promise<User> {
    // Check if email already exists
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Validate role
    const validRoles = ['owner', 'admin', 'hr', 'gm', 'vendor', 'cleaner', 'caretaker', 'gas-filler', 'staff'];
    if (!validRoles.includes(userData.role)) {
      throw new BadRequestException('Invalid role');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Get createdBy user if provided
    let createdByUser = null;
    if (userData.createdBy) {
      createdByUser = await this.usersRepository.findOne({
        where: { id: userData.createdBy },
      });
    }

    // Create user
    const user = this.usersRepository.create({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: userData.role,
      vineyardId: userData.vineyardId || null,
      phone: userData.phone || null,
      status: 'active',
      createdBy: createdByUser,
      createdByUserId: userData.createdBy || null,
    });

    return await this.usersRepository.save(user);
  }
}
