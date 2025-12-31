/**
 * Posts Service
 * Handles all posts/requests-related API calls
 */

import apiClient from '../config/api.config';

export interface Post {
  id: string;
  title: string;
  content: string;
  postedBy: string;
  role: string;
  status: string;
  postedAt: string | null;
  closedAt: string | null;
  requirements: string[];
}

class PostsService {
  /**
   * Get all posts
   */
  async getAll(): Promise<Post[]> {
    const response = await apiClient.get<Post[]>('/posts');
    return response.data;
  }

  /**
   * Get open posts only
   */
  async getOpen(): Promise<Post[]> {
    const response = await apiClient.get<Post[]>('/posts/open');
    return response.data;
  }
}

export const postsService = new PostsService();

