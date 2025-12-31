/**
 * AI Service
 * Handles TOAI assistant queries
 */

import apiClient from '../config/api.config';

class AiService {
  /**
   * Send query to AI assistant
   */
  async query(query: string): Promise<string> {
    try {
      const response = await apiClient.post<{ response: string }>('/ai/query', { query });
      return response.data.response;
    } catch (error) {
      console.error('Error querying AI:', error);
      throw error;
    }
  }
}

export const aiService = new AiService();

