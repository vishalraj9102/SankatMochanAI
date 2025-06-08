import json
import redis
from flask import current_app
from app import redis_client

class RedisHelper:
    """Helper class for Redis operations."""
    
    def __init__(self):
        self.redis = redis_client
        self.cache_ttl = current_app.config.get('CACHE_TTL', 3600)  # 1 hour default
    
    def get_search_count(self, session_id):
        """Get search count for a session."""
        try:
            key = f"search_count:{session_id}"
            count = self.redis.get(key)
            return int(count) if count else 0
        except (redis.RedisError, ValueError):
            return 0
    
    def increment_search_count(self, session_id):
        """Increment search count for a session."""
        try:
            key = f"search_count:{session_id}"
            pipe = self.redis.pipeline()
            pipe.incr(key)
            pipe.expire(key, 86400)  # Expire after 24 hours
            pipe.execute()
        except redis.RedisError:
            current_app.logger.error(f"Failed to increment search count for session {session_id}")
    
    def reset_search_count(self, session_id):
        """Reset search count for a session."""
        try:
            key = f"search_count:{session_id}"
            self.redis.delete(key)
        except redis.RedisError:
            current_app.logger.error(f"Failed to reset search count for session {session_id}")
    
    def cache_search_results(self, cache_key, results):
        """Cache search results."""
        try:
            key = f"search_cache:{cache_key}"
            self.redis.setex(
                key,
                self.cache_ttl,
                json.dumps(results)
            )
        except (redis.RedisError, TypeError):
            current_app.logger.error(f"Failed to cache search results for key {cache_key}")
    
    def get_cached_search(self, cache_key):
        """Get cached search results."""
        try:
            key = f"search_cache:{cache_key}"
            cached_data = self.redis.get(key)
            if cached_data:
                return json.loads(cached_data)
            return None
        except (redis.RedisError, json.JSONDecodeError):
            return None
    
    def blacklist_token(self, jti):
        """Blacklist a JWT token."""
        try:
            key = f"blacklist:{jti}"
            # Set expiration to match token expiration
            self.redis.setex(key, 86400, "blacklisted")  # 24 hours
        except redis.RedisError:
            current_app.logger.error(f"Failed to blacklist token {jti}")
    
    def is_token_blacklisted(self, jti):
        """Check if a JWT token is blacklisted."""
        try:
            key = f"blacklist:{jti}"
            return self.redis.exists(key)
        except redis.RedisError:
            return False
    
    def set_user_session(self, user_id, session_data, ttl=None):
        """Set user session data."""
        try:
            key = f"user_session:{user_id}"
            ttl = ttl or self.cache_ttl
            self.redis.setex(
                key,
                ttl,
                json.dumps(session_data)
            )
        except (redis.RedisError, TypeError):
            current_app.logger.error(f"Failed to set session for user {user_id}")
    
    def get_user_session(self, user_id):
        """Get user session data."""
        try:
            key = f"user_session:{user_id}"
            session_data = self.redis.get(key)
            if session_data:
                return json.loads(session_data)
            return None
        except (redis.RedisError, json.JSONDecodeError):
            return None
    
    def delete_user_session(self, user_id):
        """Delete user session data."""
        try:
            key = f"user_session:{user_id}"
            self.redis.delete(key)
        except redis.RedisError:
            current_app.logger.error(f"Failed to delete session for user {user_id}")
    
    def cache_popular_searches(self, searches):
        """Cache popular search terms."""
        try:
            key = "popular_searches"
            self.redis.setex(
                key,
                self.cache_ttl,
                json.dumps(searches)
            )
        except (redis.RedisError, TypeError):
            current_app.logger.error("Failed to cache popular searches")
    
    def get_popular_searches(self):
        """Get cached popular search terms."""
        try:
            key = "popular_searches"
            cached_data = self.redis.get(key)
            if cached_data:
                return json.loads(cached_data)
            return []
        except (redis.RedisError, json.JSONDecodeError):
            return []
    
    def health_check(self):
        """Check Redis connection health."""
        try:
            self.redis.ping()
            return True
        except redis.RedisError:
            return False 