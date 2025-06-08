from flask import jsonify, current_app
from werkzeug.exceptions import HTTPException
import traceback

def register_error_handlers(app):
    """Register error handlers for the Flask application."""
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'error': 'Bad Request',
            'message': 'The request was invalid or cannot be served.',
            'code': 400
        }), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Authentication required or invalid credentials.',
            'code': 401
        }), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({
            'error': 'Forbidden',
            'message': 'You do not have permission to access this resource.',
            'code': 403
        }), 403
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'error': 'Not Found',
            'message': 'The requested resource was not found.',
            'code': 404
        }), 404
    
    @app.errorhandler(409)
    def conflict(error):
        return jsonify({
            'error': 'Conflict',
            'message': 'The request conflicts with the current state of the resource.',
            'code': 409
        }), 409
    
    @app.errorhandler(422)
    def unprocessable_entity(error):
        return jsonify({
            'error': 'Unprocessable Entity',
            'message': 'The request was well-formed but contains semantic errors.',
            'code': 422
        }), 422
    
    @app.errorhandler(429)
    def rate_limit_exceeded(error):
        return jsonify({
            'error': 'Rate Limit Exceeded',
            'message': 'Too many requests. Please try again later.',
            'code': 429
        }), 429
    
    @app.errorhandler(500)
    def internal_server_error(error):
        current_app.logger.error(f"Internal server error: {str(error)}")
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred. Please try again later.',
            'code': 500
        }), 500
    
    @app.errorhandler(HTTPException)
    def handle_http_exception(error):
        """Handle all HTTP exceptions."""
        return jsonify({
            'error': error.name,
            'message': error.description,
            'code': error.code
        }), error.code
    
    @app.errorhandler(Exception)
    def handle_generic_exception(error):
        """Handle all other exceptions."""
        current_app.logger.error(f"Unhandled exception: {str(error)}")
        current_app.logger.error(traceback.format_exc())
        
        if current_app.debug:
            return jsonify({
                'error': 'Internal Server Error',
                'message': str(error),
                'traceback': traceback.format_exc(),
                'code': 500
            }), 500
        else:
            return jsonify({
                'error': 'Internal Server Error',
                'message': 'An unexpected error occurred. Please try again later.',
                'code': 500
            }), 500 