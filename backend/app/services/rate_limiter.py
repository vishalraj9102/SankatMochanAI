from flask import current_app
from app.utils.redis_helper import RedisHelper
from app.models.search_history import SearchHistory

class RateLimiter:
    """Service for managing search rate limits."""
    
    def __init__(self):
        self.redis_helper = RedisHelper()
        self.free_limit = current_app.config.get('FREE_SEARCH_LIMIT', 5)
    
    def can_search(self, user_id=None, session_id=None):
        """
        Check if user/session can perform a search.
        
        Args:
            user_id: Authenticated user ID (None for guests)
            session_id: Session ID for guest users
            
        Returns:
            tuple: (can_search: bool, remaining_searches: int)
        """
        if user_id:
            # Authenticated users have unlimited searches
            return True, -1  # -1 indicates unlimited
        
        if not session_id:
            return False, 0
        
        # Get current search count from Redis
        current_count = self.redis_helper.get_search_count(session_id)
        remaining = max(0, self.free_limit - current_count)
        
        return remaining > 0, remaining
    
    def increment_search_count(self, user_id=None, session_id=None):
        """
        Increment search count for user/session.
        
        Args:
            user_id: Authenticated user ID
            session_id: Session ID for guest users
        """
        if user_id:
            # For authenticated users, we don't need to track in Redis
            # The count is tracked in the database via SearchHistory
            return
        
        if session_id:
            self.redis_helper.increment_search_count(session_id)
    
    def get_search_count(self, user_id=None, session_id=None):
        """
        Get current search count for user/session.
        
        Args:
            user_id: Authenticated user ID
            session_id: Session ID for guest users
            
        Returns:
            int: Current search count
        """
        if user_id:
            # Get count from database for authenticated users
            return SearchHistory.get_user_search_count(user_id=user_id)
        
        if session_id:
            return self.redis_helper.get_search_count(session_id)
        
        return 0
    
    def reset_search_count(self, session_id):
        """
        Reset search count for a session (used when user signs up).
        
        Args:
            session_id: Session ID to reset
        """
        self.redis_helper.reset_search_count(session_id) 
 