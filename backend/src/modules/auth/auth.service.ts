import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private demoUserCreated = false;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    // DEMO MODE: Auto-create admin user if database is empty
    if (process.env.DEMO_MODE === 'true' || !this.demoUserCreated) {
      try {
        const userCount = await this.dataSource.query('SELECT COUNT(*) as count FROM users');
        if (userCount[0]?.count === '0' || parseInt(userCount[0]?.count) === 0) {
          const hashedPassword = await bcrypt.hash('admin123', 10);
          await this.dataSource.query(`
            INSERT INTO users (id, email, password, name, role, status, created_at, updated_at)
            VALUES (
              gen_random_uuid(),
              'admin@demo.com',
              $1,
              'Demo Admin',
              'owner',
              'active',
              NOW(),
              NOW()
            )
            ON CONFLICT (email) DO NOTHING
          `, [hashedPassword]);
          console.log('✅ Demo admin user created: admin@demo.com / admin123');
          this.demoUserCreated = true;
        }
      } catch (error) {
        // Silent fail - database might not be ready
      }
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      
      // DEMO MODE: Allow login with demo credentials even if DB is empty
      if (process.env.DEMO_MODE === 'true') {
        if (email === 'admin@demo.com' && password === 'admin123') {
          return {
            id: 'demo-admin-id',
            email: 'admin@demo.com',
            name: 'Demo Admin',
            role: 'owner',
          };
        }
        // Also allow standard demo credentials
        if (email === 'owner@sukrivineyard.com' && password === 'Admin@123') {
          if (user) {
            const { password: _, ...result } = user;
            return result;
          }
          // Return demo user if DB user doesn't exist
          return {
            id: 'demo-owner-id',
            email: 'owner@sukrivineyard.com',
            name: 'Vineyard Owner',
            role: 'owner',
          };
        }
      }
      
      if (user && (await bcrypt.compare(password, user.password))) {
        const { password: _, ...result } = user;
        return result;
      }
      
      return null;
    } catch (error) {
      console.error('Login validation error:', error);
      // DEMO MODE: Fallback to demo credentials on error
      if (process.env.DEMO_MODE === 'true') {
        if (email === 'admin@demo.com' && password === 'admin123') {
          return {
            id: 'demo-admin-id',
            email: 'admin@demo.com',
            name: 'Demo Admin',
            role: 'owner',
          };
        }
      }
      return null;
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}

