import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchService } from '../services/searchService';
import { SearchResource, SearchFilters, ResourceType, DifficultyLevel } from '../types/search';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: searchResults,
    error,
    refetch
  } = useQuery(
    ['search', query, filters],
    () => searchService.search({ query, filters }),
    {
      enabled: !!query,
      onError: (error: any) => {
        if (error.message.includes('signup')) {
          setShowSignupModal(true);
        } else {
          toast.error(error.message || 'Search failed');
        }
      }
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsLoading(true);
      setSearchParams({ q: query });
      refetch();
    }
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resourceTypeOptions = [
    { value: ResourceType.AI_TOOL, label: 'AI Tools', icon: '🤖' },
    { value: ResourceType.YOUTUBE_CHANNEL, label: 'YouTube Channels', icon: '📺' },
    { value: ResourceType.COURSE, label: 'Courses', icon: '🎓' },
    { value: ResourceType.WEBSITE, label: 'Websites', icon: '🌐' },
    { value: ResourceType.TUTORIAL, label: 'Tutorials', icon: '📚' },
    { value: ResourceType.DOCUMENTATION, label: 'Documentation', icon: '📖' }
  ];

  const difficultyOptions = [
    { value: DifficultyLevel.BEGINNER, label: 'Beginner' },
    { value: DifficultyLevel.INTERMEDIATE, label: 'Intermediate' },
    { value: DifficultyLevel.ADVANCED, label: 'Advanced' },
    { value: DifficultyLevel.EXPERT, label: 'Expert' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search for AI tools, courses, channels, and more...
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="input pr-12"
                    placeholder="e.g., ChatGPT alternatives, React tutorials, Machine Learning courses"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-primary-600"
                  >
                    🔍
                  </button>
                </div>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="btn-primary px-8 py-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Resource Type Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Resource Type</h4>
                <div className="space-y-2">
                  {resourceTypeOptions.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.type?.includes(option.value) || false}
                        onChange={(e) => {
                          const currentTypes = filters.type || [];
                          const newTypes = e.target.checked
                            ? [...currentTypes, option.value]
                            : currentTypes.filter(t => t !== option.value);
                          handleFilterChange({ type: newTypes });
                        }}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 flex items-center">
                        <span className="mr-1">{option.icon}</span>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Free/Paid Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Pricing</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pricing"
                      checked={filters.is_free === undefined}
                      onChange={() => handleFilterChange({ is_free: undefined })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">All</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pricing"
                      checked={filters.is_free === true}
                      onChange={() => handleFilterChange({ is_free: true })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Free</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pricing"
                      checked={filters.is_free === false}
                      onChange={() => handleFilterChange({ is_free: false })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Paid</span>
                  </label>
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Difficulty Level</h4>
                <div className="space-y-2">
                  {difficultyOptions.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.difficulty_level?.includes(option.value) || false}
                        onChange={(e) => {
                          const currentLevels = filters.difficulty_level || [];
                          const newLevels = e.target.checked
                            ? [...currentLevels, option.value]
                            : currentLevels.filter(l => l !== option.value);
                          handleFilterChange({ difficulty_level: newLevels });
                        }}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({})}
                className="w-full btn-outline text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="large" />
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">
                  ❌ Search failed. Please try again.
                </div>
                <button
                  onClick={() => refetch()}
                  className="btn-primary"
                >
                  Retry Search
                </button>
              </div>
            )}

            {searchResults && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Search Results ({searchResults.total})
                  </h2>
                  <div className="text-sm text-gray-600">
                    Page {searchResults.page} of {Math.ceil(searchResults.total / searchResults.limit)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {searchResults.resources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>

                {searchResults.resources.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">
                      🔍 No resources found for your search.
                    </div>
                    <p className="text-gray-400">
                      Try adjusting your search terms or filters.
                    </p>
                  </div>
                )}
              </div>
            )}

            {!query && !isLoading && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  🚀 Start your search to discover amazing resources!
                </div>
                <p className="text-gray-400">
                  Enter keywords to find AI tools, courses, YouTube channels, and more.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Sign up to continue searching
            </h3>
            <p className="text-gray-600 mb-6">
              You've reached the limit of 5 free searches. Sign up to get unlimited access to our resources!
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowSignupModal(false)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <a
                href="/signup"
                className="btn-primary flex-1 text-center"
              >
                Sign Up Free
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Resource Card Component
const ResourceCard: React.FC<{ resource: SearchResource }> = ({ resource }) => {
  const getTypeIcon = (type: ResourceType) => {
    const icons = {
      [ResourceType.AI_TOOL]: '🤖',
      [ResourceType.YOUTUBE_CHANNEL]: '📺',
      [ResourceType.COURSE]: '🎓',
      [ResourceType.WEBSITE]: '🌐',
      [ResourceType.TUTORIAL]: '📚',
      [ResourceType.DOCUMENTATION]: '📖'
    };
    return icons[type] || '📄';
  };

  const getDifficultyColor = (level: DifficultyLevel) => {
    const colors = {
      [DifficultyLevel.BEGINNER]: 'bg-green-100 text-green-800',
      [DifficultyLevel.INTERMEDIATE]: 'bg-yellow-100 text-yellow-800',
      [DifficultyLevel.ADVANCED]: 'bg-orange-100 text-orange-800',
      [DifficultyLevel.EXPERT]: 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="card-hover">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getTypeIcon(resource.type)}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty_level)}`}>
              {resource.difficulty_level}
            </span>
          </div>
          {resource.is_free && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Free
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {resource.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {resource.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>⭐ {resource.rating || 'N/A'}</span>
            <span>👥 {resource.popularity_score}</span>
          </div>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm"
          >
            Visit →
          </a>
        </div>

        {resource.tags && resource.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{resource.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 