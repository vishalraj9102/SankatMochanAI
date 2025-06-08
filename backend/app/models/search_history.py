from datetime import datetime
import json
from app import db

class SearchHistory(db.Model):
    """Search history model to track user searches and results."""
    
    __tablename__ = 'search_history'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Nullable for guest searches
    
    # Search parameters
    query = db.Column(db.Text, nullable=False)
    filters = db.Column(db.JSON, nullable=True)  # Store filters as JSON
    
    # Search results (cached)
    results = db.Column(db.JSON, nullable=True)  # Store results as JSON
    result_count = db.Column(db.Integer, default=0)
    
    # Metadata
    search_type = db.Column(db.String(50), default='ai_powered')  # ai_powered, cached, etc.
    execution_time = db.Column(db.Float, nullable=True)  # Time taken for search
    
    # Guest session tracking
    session_id = db.Column(db.String(100), nullable=True)  # For tracking guest searches
    ip_address = db.Column(db.String(45), nullable=True)  # Store IP for analytics
    
    # Favorites
    is_favorite = db.Column(db.Boolean, default=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def __init__(self, query, user_id=None, session_id=None, ip_address=None, 
                 filters=None, results=None):
        self.query = query
        self.user_id = user_id
        self.session_id = session_id
        self.ip_address = ip_address
        self.filters = filters or {}
        self.results = results or []
        self.result_count = len(results) if results else 0
    
    def set_results(self, results, execution_time=None):
        """Set search results and metadata."""
        self.results = results
        self.result_count = len(results) if results else 0
        self.execution_time = execution_time
        db.session.commit()
    
    def add_to_favorites(self):
        """Mark search as favorite."""
        self.is_favorite = True
        db.session.commit()
    
    def remove_from_favorites(self):
        """Remove search from favorites."""
        self.is_favorite = False
        db.session.commit()
    
    def to_dict(self, include_results=True):
        """Convert search history object to dictionary."""
        data = {
            'id': self.id,
            'query': self.query,
            'filters': self.filters,
            'result_count': self.result_count,
            'search_type': self.search_type,
            'execution_time': self.execution_time,
            'is_favorite': self.is_favorite,
            'created_at': self.created_at.isoformat()
        }
        
        if include_results:
            data['results'] = self.results
        
        return data
    
    @classmethod
    def get_user_search_count(cls, user_id=None, session_id=None):
        """Get search count for user or session."""
        query = cls.query
        
        if user_id:
            query = query.filter_by(user_id=user_id)
        elif session_id:
            query = query.filter_by(session_id=session_id)
        else:
            return 0
        
        return query.count()
    
    @classmethod
    def get_recent_searches(cls, user_id, limit=10):
        """Get recent searches for a user."""
        return cls.query.filter_by(user_id=user_id)\
                       .order_by(cls.created_at.desc())\
                       .limit(limit)\
                       .all()
    
    @classmethod
    def get_favorites(cls, user_id):
        """Get favorite searches for a user."""
        return cls.query.filter_by(user_id=user_id, is_favorite=True)\
                       .order_by(cls.created_at.desc())\
                       .all()
    
    def __repr__(self):
        return f'<SearchHistory {self.query[:50]}...>' 