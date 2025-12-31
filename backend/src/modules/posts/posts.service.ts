import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostRequirement } from './entities/post-requirement.entity';
import { format } from 'date-fns';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostRequirement)
    private requirementRepository: Repository<PostRequirement>,
  ) {}

  async findAll() {
    try {
      const posts = await this.postRepository.find({
        relations: ['postedBy', 'requirements'],
        order: {
          postedAt: 'DESC',
        },
      });

      return posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        postedBy: post.postedByName,
        role: post.postedByRole,
        status: post.status,
        postedAt: post.postedAt ? post.postedAt.toISOString() : null,
        closedAt: post.closedAt ? post.closedAt.toISOString() : null,
        requirements: post.requirements?.map((req) => req.requirement) || [],
      }));
    } catch (error) {
      console.error('Error in posts findAll:', error);
      throw error;
    }
  }

  async getOpenPosts() {
    try {
      const posts = await this.postRepository.find({
        where: { status: 'open' },
        relations: ['postedBy', 'requirements'],
        order: {
          postedAt: 'DESC',
        },
      });

      return posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        postedBy: post.postedByName,
        role: post.postedByRole,
        status: post.status,
        postedAt: post.postedAt ? post.postedAt.toISOString() : null,
        requirements: post.requirements?.map((req) => req.requirement) || [],
      }));
    } catch (error) {
      console.error('Error in posts getOpenPosts:', error);
      throw error;
    }
  }
}

