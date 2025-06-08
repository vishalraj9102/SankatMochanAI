#!/usr/bin/env python3
"""
Sankat Mochan - AI Resource Discovery Platform
Flask Application Runner
"""

import os
from app import create_app, db
from flask_migrate import upgrade

def deploy():
    """Run deployment tasks."""
    app = create_app(os.getenv('FLASK_CONFIG') or 'default')
    
    with app.app_context():
        # Create database tables
        db.create_all()
        
        # Migrate database to latest revision
        try:
            upgrade()
        except Exception as e:
            print(f"Migration error (this is normal for first run): {e}")

def main():
    """Main application entry point."""
    config_name = os.getenv('FLASK_CONFIG', 'development')
    app = create_app(config_name)
    
    # Get configuration
    host = os.getenv('FLASK_HOST', '127.0.0.1')
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() in ['true', '1', 'on']
    
    print(f"Starting Sankat Mochan API server...")
    print(f"Environment: {config_name}")
    print(f"Debug mode: {debug}")
    print(f"Server: http://{host}:{port}")
    
    # Run the application
    app.run(
        host='0.0.0.0',  # Listen on all interfaces
        port=port,
        debug=debug,
        threaded=True
    )

if __name__ == '__main__':
    main() 