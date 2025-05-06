
import os

class Config:
    # Flask configuration
    SECRET_KEY = os.environ.get('SECRET_KEY', 'mysecretkey')

    # PostgreSQL Configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://user:password@db:5432/sankatmochan_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Redis Configuration
    REDIS_URL = os.environ.get('REDIS_URL', 'redis://redis:6379/0')
