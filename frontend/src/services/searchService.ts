import { apiService } from './api';
import { SearchRequest, SearchResponse, SearchHistory } from '../types/search';

class SearchService {
  async search(searchRequest: SearchRequest): Promise<SearchResponse> {
    try {
      const response = await apiService.post<SearchResponse>('/search', searchRequest);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Search failed');
    }
  }

  async getSearchHistory(): Promise<SearchHistory[]> {
    try {
      const response = await apiService.get<{ searches: SearchHistory[] }>('/search/history');
      return response.searches;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get search history');
    }
  }

  async getSearchCount(): Promise<number> {
    try {
      const response = await apiService.get<{ remaining_searches: number }>('/search/rate-limit/status');
      return response.remaining_searches || 0;
    } catch (error: any) {
      return 0; // Return 0 if not authenticated
    }
  }

  async clearSearchHistory(): Promise<void> {
    try {
      await apiService.del('/search/history');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to clear search history');
    }
  }
}

export const searchService = new SearchService(); 