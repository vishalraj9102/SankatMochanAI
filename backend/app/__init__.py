from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import redis
from config import config

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
redis_client = None

def create_app(config_name='default'):
    """Application factory pattern."""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Configure CORS
    CORS(app, 
         origins=["http://localhost:3000"],
         allow_credentials=True,
         supports_credentials=True,
         resources={r"/api/*": {
             "origins": ["http://localhost:3000"],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization", "Accept"],
             "expose_headers": ["Content-Type", "Authorization"],
             "max_age": 3600
         }})
    
    # Add CORS headers to all responses
    @app.after_request
    def after_request(response):
        if request.method == 'OPTIONS':
            response = make_response()
            response.status_code = 200
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    
    # Initialize Redis
    global redis_client
    redis_client = redis.from_url(app.config['REDIS_URL'])
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.search import search_bp
    from app.routes.user import user_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(search_bp, url_prefix='/api')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    
    # Register error handlers
    from app.utils.error_handlers import register_error_handlers
    register_error_handlers(app)
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Sankat Mochan API is running'}
    
    return app 