import { Controller, Get, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('posts')
// Temporarily disabled for testing - re-enable in production
// @UseGuards(JwtAuthGuard, RolesGuard)
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  @Roles('owner', 'gm', 'admin', 'hr', 'vendor')
  findAll() {
    return this.postsService.findAll();
  }

  @Get('open')
  @Roles('owner', 'gm', 'admin', 'hr', 'vendor')
  getOpenPosts() {
    return this.postsService.getOpenPosts();
  }
}

