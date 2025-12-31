import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
// Temporarily disabled for testing - re-enable in production
// @UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get()
  @Roles('owner', 'admin', 'hr')
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @Roles('owner', 'admin', 'hr')
  async create(@Body() createUserDto: {
    email: string;
    password: string;
    name: string;
    role: string;
    vineyardId?: string;
    phone?: string;
    createdBy?: string;
  }) {
    return this.usersService.create(createUserDto);
  }
}

