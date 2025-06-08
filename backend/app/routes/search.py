from flask import Blueprint, request, jsonify, current_app, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
import time
import hashlib
import json

from app import db
from app.models.user import User
from app.models.search_history import SearchHistory
from app.services.ai_service import AIService
from app.services.rate_limiter import RateLimiter
from app.utils.redis_helper import RedisHelper

search_bp = Blueprint('search', __name__)

@search_bp.route('/search', methods=['OPTIONS'])
def handle_options():
    """Handle OPTIONS request for CORS preflight"""
    response = make_response()
    response.status_code = 200
    return response

@search_bp.route('/search', methods=['POST'])
def search():
    """Perform AI-powered resource search with rate limiting."""
    start_time = time.time()
    
    try:
        data = request.get_json()
        
        if not data or 'query' not in data:
            return jsonify({'error': 'Search query is required'}), 400
        
        query = data['query'].strip()
        if not query:
            return jsonify({'error': 'Search query cannot be empty'}), 400
        
        filters = data.get('filters', {})
        session_id = data.get('session_id')  # For guest users
        ip_address = request.remote_addr
        
        # Check if user is authenticated
        user_id = None
        try:
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
        except:
            pass  # User is not authenticated
        
        # Rate limiting check
        rate_limiter = RateLimiter()
        can_search, remaining_searches = rate_limiter.can_search(
            user_id=user_id, 
            session_id=session_id
        )
        
        if not can_search:
            return jsonify({
                'error': 'Search limit exceeded. Please sign up to continue searching.',
                'code': 'RATE_LIMIT_EXCEEDED',
                'remaining_searches': 0
            }), 429
        
        # Check cache first
        cache_key = _generate_cache_key(query, filters)
        redis_helper = RedisHelper()
        cached_results = redis_helper.get_cached_search(cache_key)
        
        if cached_results:
            return jsonify(cached_results), 200
        
        # Perform search
        ai_service = AIService()
        results = ai_service.search_resources(query, filters)
        
        # Cache results
        redis_helper.cache_search(cache_key, results)
        
        # Log search if user is authenticated
        if user_id:
            search_history = SearchHistory(
                user_id=user_id,
                query=query,
                filters=json.dumps(filters),
                results_count=len(results)
            )
            db.session.add(search_history)
            db.session.commit()
        
        return jsonify({
            'results': results,
            'remaining_searches': remaining_searches,
            'execution_time': time.time() - start_time
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Search error: {str(e)}")
        return jsonify({'error': 'Search failed'}), 500

@search_bp.route('/search', methods=['OPTIONS'])
def search_options():
    return '', 204

@search_bp.route('/search/history', methods=['GET'])
@jwt_required()
def get_search_history():
    """Get user search history."""
    try:
        current_user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Validate pagination parameters
        per_page = min(per_page, 50)  # Max 50 items per page
        
        # Get paginated search history
        pagination = SearchHistory.query.filter_by(user_id=current_user_id)\
                                      .order_by(SearchHistory.created_at.desc())\
                                      .paginate(
                                          page=page,
                                          per_page=per_page,
                                          error_out=False
                                      )
        
        searches = [search.to_dict(include_results=False) for search in pagination.items]
        
        return jsonify({
            'searches': searches,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Search history error: {str(e)}")
        return jsonify({'error': 'Failed to fetch search history'}), 500

@search_bp.route('/search/history/<int:search_id>', methods=['GET'])
@jwt_required()
def get_search_details(search_id):
    """Get detailed search results by ID."""
    try:
        current_user_id = get_jwt_identity()
        
        search = SearchHistory.query.filter_by(
            id=search_id,
            user_id=current_user_id
        ).first()
        
        if not search:
            return jsonify({'error': 'Search not found'}), 404
        
        return jsonify({'search': search.to_dict()}), 200
        
    except Exception as e:
        current_app.logger.error(f"Search details error: {str(e)}")
        return jsonify({'error': 'Failed to fetch search details'}), 500

@search_bp.route('/search/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    """Get user's favorite searches."""
    try:
        current_user_id = get_jwt_identity()
        
        favorites = SearchHistory.get_favorites(current_user_id)
        favorite_searches = [search.to_dict() for search in favorites]
        
        return jsonify({'favorites': favorite_searches}), 200
        
    except Exception as e:
        current_app.logger.error(f"Favorites error: {str(e)}")
        return jsonify({'error': 'Failed to fetch favorites'}), 500

@search_bp.route('/search/favorites/<int:search_id>', methods=['POST'])
@jwt_required()
def add_to_favorites(search_id):
    """Add search to favorites."""
    try:
        current_user_id = get_jwt_identity()
        
        search = SearchHistory.query.filter_by(
            id=search_id,
            user_id=current_user_id
        ).first()
        
        if not search:
            return jsonify({'error': 'Search not found'}), 404
        
        search.add_to_favorites()
        
        return jsonify({
            'message': 'Added to favorites',
            'search': search.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Add to favorites error: {str(e)}")
        return jsonify({'error': 'Failed to add to favorites'}), 500

@search_bp.route('/search/favorites/<int:search_id>', methods=['DELETE'])
@jwt_required()
def remove_from_favorites(search_id):
    """Remove search from favorites."""
    try:
        current_user_id = get_jwt_identity()
        
        search = SearchHistory.query.filter_by(
            id=search_id,
            user_id=current_user_id
        ).first()
        
        if not search:
            return jsonify({'error': 'Search not found'}), 404
        
        search.remove_from_favorites()
        
        return jsonify({
            'message': 'Removed from favorites',
            'search': search.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Remove from favorites error: {str(e)}")
        return jsonify({'error': 'Failed to remove from favorites'}), 500

@search_bp.route('/search/suggestions', methods=['GET'])
def get_search_suggestions():
    """Get search suggestions based on popular queries."""
    try:
        # Get popular search terms from recent searches
        suggestions = db.session.query(SearchHistory.query)\
                               .distinct()\
                               .order_by(db.func.count(SearchHistory.query).desc())\
                               .limit(10)\
                               .all()
        
        popular_queries = [s.query for s in suggestions]
        
        # Add some predefined suggestions
        predefined_suggestions = [
            "AI tools for coding",
            "Python programming courses",
            "React tutorials YouTube",
            "Machine learning resources",
            "Web development bootcamp",
            "Data science tools",
            "JavaScript frameworks",
            "DevOps learning path"
        ]
        
        # Combine and deduplicate
        all_suggestions = list(set(popular_queries + predefined_suggestions))
        
        return jsonify({'suggestions': all_suggestions[:15]}), 200
        
    except Exception as e:
        current_app.logger.error(f"Suggestions error: {str(e)}")
        return jsonify({'suggestions': []}), 200

@search_bp.route('/search/rate-limit/status', methods=['GET'])
def get_rate_limit_status():
    """Get current rate limit status for user/session."""
    try:
        session_id = request.args.get('session_id')
        
        # Check if user is authenticated
        user_id = None
        try:
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
        except:
            pass
        
        rate_limiter = RateLimiter()
        can_search, remaining_searches = rate_limiter.can_search(
            user_id=user_id,
            session_id=session_id
        )
        
        return jsonify({
            'can_search': can_search,
            'remaining_searches': remaining_searches,
            'is_authenticated': user_id is not None
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Rate limit status error: {str(e)}")
        return jsonify({'error': 'Failed to get rate limit status'}), 500

def _generate_cache_key(query, filters):
    """Generate a unique cache key for the search query and filters."""
    key_data = {
        'query': query.lower().strip(),
        'filters': sorted(filters.items()) if filters else {}
    }
    return hashlib.md5(json.dumps(key_data, sort_keys=True).encode()).hexdigest() 