export interface SearchResource {
  id: string;
  name: string;
  description: string;
  url: string;
  type: ResourceType;
  category: string;
  is_free: boolean;
  difficulty_level: DifficultyLevel;
  popularity_score: number;
  tags: string[];
  thumbnail_url?: string;
  rating?: number;
  created_at: string;
}

export enum ResourceType {
  AI_TOOL = 'ai_tool',
  YOUTUBE_CHANNEL = 'youtube_channel',
  COURSE = 'course',
  WEBSITE = 'website',
  TUTORIAL = 'tutorial',
  DOCUMENTATION = 'documentation'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export interface SearchFilters {
  type?: ResourceType[];
  is_free?: boolean;
  difficulty_level?: DifficultyLevel[];
  category?: string[];
  min_rating?: number;
}

export interface SearchRequest {
  query: string;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  resources: SearchResource[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface SearchHistory {
  id: number;
  query: string;
  filters: SearchFilters;
  results_count: number;
  created_at: string;
} 