from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models.user import User
from app.models.search_history import SearchHistory
from app.utils.validators import validate_name, validate_email

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile information."""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get additional statistics
        total_searches = SearchHistory.get_user_search_count(current_user_id)
        recent_searches = SearchHistory.get_recent_searches(current_user_id, limit=5)
        favorites_count = SearchHistory.query.filter_by(
            user_id=current_user_id, 
            is_favorite=True
        ).count()
        
        profile_data = user.to_dict()
        profile_data.update({
            'statistics': {
                'total_searches': total_searches,
                'favorites_count': favorites_count,
                'recent_searches': [search.to_dict(include_results=False) 
                                  for search in recent_searches]
            }
        })
        
        return jsonify({'profile': profile_data}), 200
        
    except Exception as e:
        current_app.logger.error(f"Profile fetch error: {str(e)}")
        return jsonify({'error': 'Failed to fetch profile'}), 500

@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile information."""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update name if provided
        if 'name' in data:
            name = data['name'].strip() if data['name'] else ''
            if name and not validate_name(name):
                return jsonify({'error': 'Invalid name format'}), 400
            user.name = name or None
        
        # Update avatar URL if provided
        if 'avatar_url' in data:
            avatar_url = data['avatar_url'].strip() if data['avatar_url'] else ''
            user.avatar_url = avatar_url or None
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'profile': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Profile update error: {str(e)}")
        return jsonify({'error': 'Failed to update profile'}), 500

@user_bp.route('/statistics', methods=['GET'])
@jwt_required()
def get_statistics():
    """Get user statistics and analytics."""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get comprehensive statistics
        total_searches = SearchHistory.get_user_search_count(current_user_id)
        favorites_count = SearchHistory.query.filter_by(
            user_id=current_user_id, 
            is_favorite=True
        ).count()
        
        # Get search statistics by type
        search_stats = db.session.query(
            SearchHistory.search_type,
            db.func.count(SearchHistory.id).label('count')
        ).filter_by(user_id=current_user_id)\
         .group_by(SearchHistory.search_type)\
         .all()
        
        search_type_stats = {stat.search_type: stat.count for stat in search_stats}
        
        # Get recent activity (last 30 days)
        from datetime import datetime, timedelta
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        recent_searches = SearchHistory.query.filter(
            SearchHistory.user_id == current_user_id,
            SearchHistory.created_at >= thirty_days_ago
        ).count()
        
        # Get popular search terms for this user
        popular_queries = db.session.query(
            SearchHistory.query,
            db.func.count(SearchHistory.id).label('count')
        ).filter_by(user_id=current_user_id)\
         .group_by(SearchHistory.query)\
         .order_by(db.func.count(SearchHistory.id).desc())\
         .limit(10)\
         .all()
        
        statistics = {
            'total_searches': total_searches,
            'favorites_count': favorites_count,
            'recent_searches_30_days': recent_searches,
            'search_type_breakdown': search_type_stats,
            'popular_queries': [
                {'query': query.query, 'count': query.count} 
                for query in popular_queries
            ],
            'member_since': user.created_at.isoformat(),
            'last_login': user.last_login.isoformat() if user.last_login else None
        }
        
        return jsonify({'statistics': statistics}), 200
        
    except Exception as e:
        current_app.logger.error(f"Statistics fetch error: {str(e)}")
        return jsonify({'error': 'Failed to fetch statistics'}), 500

@user_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password."""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        if not data or not all(k in data for k in ('current_password', 'new_password')):
            return jsonify({'error': 'Current password and new password are required'}), 400
        
        current_password = data['current_password']
        new_password = data['new_password']
        
        # Verify current password
        if not user.check_password(current_password):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        # Validate new password
        from app.utils.validators import validate_password
        password_errors = validate_password(new_password)
        if password_errors:
            return jsonify({'error': password_errors[0]}), 400
        
        # Update password
        user.set_password(new_password)
        db.session.commit()
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Password change error: {str(e)}")
        return jsonify({'error': 'Failed to change password'}), 500

@user_bp.route('/delete-account', methods=['DELETE'])
@jwt_required()
def delete_account():
    """Delete user account and all associated data."""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        if not data or 'password' not in data:
            return jsonify({'error': 'Password confirmation required'}), 400
        
        password = data['password']
        
        # Verify password for account deletion
        if not user.check_password(password):
            return jsonify({'error': 'Password is incorrect'}), 401
        
        # Delete user (cascade will handle search history)
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'Account deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Account deletion error: {str(e)}")
        return jsonify({'error': 'Failed to delete account'}), 500

@user_bp.route('/export-data', methods=['GET'])
@jwt_required()
def export_data():
    """Export user data for GDPR compliance."""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get all user data
        search_history = SearchHistory.query.filter_by(user_id=current_user_id)\
                                          .order_by(SearchHistory.created_at.desc())\
                                          .all()
        
        export_data = {
            'user_profile': user.to_dict(),
            'search_history': [search.to_dict() for search in search_history],
            'export_date': datetime.utcnow().isoformat(),
            'total_searches': len(search_history)
        }
        
        return jsonify({'data': export_data}), 200
        
    except Exception as e:
        current_app.logger.error(f"Data export error: {str(e)}")
        return jsonify({'error': 'Failed to export data'}), 500 