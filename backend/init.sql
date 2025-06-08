-- Database initialization script for Sankat Mochan

-- Create database if not exists (this is handled by docker-compose)
-- CREATE DATABASE IF NOT EXISTS sankat_mochan;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(100),
    avatar_url VARCHAR(500),
    google_id VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_login TIMESTAMP
);

-- Search history table
CREATE TABLE IF NOT EXISTS search_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    filters JSONB DEFAULT '{}',
    results_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Resources table (for storing AI tools, courses, etc.)
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    is_free BOOLEAN DEFAULT TRUE,
    difficulty_level VARCHAR(20) DEFAULT 'beginner',
    popularity_score INTEGER DEFAULT 0,
    rating DECIMAL(3,2),
    tags TEXT[],
    thumbnail_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- User favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(user_id, resource_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_is_free ON resources(is_free);
CREATE INDEX IF NOT EXISTS idx_resources_difficulty_level ON resources(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);

-- Insert sample data
INSERT INTO resources (name, description, url, type, category, is_free, difficulty_level, popularity_score, rating, tags) VALUES
('ChatGPT', 'Advanced AI chatbot for conversations and assistance', 'https://chat.openai.com', 'ai_tool', 'Conversational AI', false, 'beginner', 95, 4.8, ARRAY['AI', 'Chatbot', 'OpenAI']),
('Claude', 'AI assistant by Anthropic for helpful conversations', 'https://claude.ai', 'ai_tool', 'Conversational AI', true, 'beginner', 85, 4.7, ARRAY['AI', 'Assistant', 'Anthropic']),
('Midjourney', 'AI-powered image generation tool', 'https://midjourney.com', 'ai_tool', 'Image Generation', false, 'intermediate', 90, 4.6, ARRAY['AI', 'Image', 'Art']),
('Stable Diffusion', 'Open-source AI image generation', 'https://stability.ai', 'ai_tool', 'Image Generation', true, 'advanced', 80, 4.5, ARRAY['AI', 'Open Source', 'Image']),
('GitHub Copilot', 'AI pair programmer for coding assistance', 'https://github.com/features/copilot', 'ai_tool', 'Development', false, 'intermediate', 88, 4.4, ARRAY['AI', 'Coding', 'GitHub']),

-- YouTube Channels
('Fireship', 'Quick programming tutorials and tech news', 'https://youtube.com/@Fireship', 'youtube_channel', 'Programming', true, 'intermediate', 92, 4.9, ARRAY['Programming', 'Web Dev', 'Tech']),
('3Blue1Brown', 'Mathematical concepts explained visually', 'https://youtube.com/@3blue1brown', 'youtube_channel', 'Mathematics', true, 'intermediate', 95, 4.9, ARRAY['Math', 'Visualization', 'Education']),
('Two Minute Papers', 'AI and computer graphics research explained', 'https://youtube.com/@TwoMinutePapers', 'youtube_channel', 'AI Research', true, 'intermediate', 88, 4.8, ARRAY['AI', 'Research', 'Graphics']),
('Sentdex', 'Python programming and machine learning tutorials', 'https://youtube.com/@sentdex', 'youtube_channel', 'Machine Learning', true, 'beginner', 85, 4.7, ARRAY['Python', 'ML', 'Programming']),

-- Courses
('CS50', 'Harvard''s Introduction to Computer Science', 'https://cs50.harvard.edu', 'course', 'Computer Science', true, 'beginner', 98, 4.9, ARRAY['CS', 'Harvard', 'Programming']),
('Machine Learning Course by Andrew Ng', 'Comprehensive ML course on Coursera', 'https://coursera.org/learn/machine-learning', 'course', 'Machine Learning', false, 'intermediate', 95, 4.8, ARRAY['ML', 'Coursera', 'Stanford']),
('The Complete Web Developer Bootcamp', 'Full-stack web development course', 'https://udemy.com/course/the-complete-web-development-bootcamp', 'course', 'Web Development', false, 'beginner', 90, 4.6, ARRAY['Web Dev', 'Full Stack', 'Udemy']),
('Deep Learning Specialization', 'Advanced deep learning concepts', 'https://coursera.org/specializations/deep-learning', 'course', 'Deep Learning', false, 'advanced', 92, 4.8, ARRAY['Deep Learning', 'Neural Networks', 'AI']),

-- Websites
('Stack Overflow', 'Programming Q&A community', 'https://stackoverflow.com', 'website', 'Programming', true, 'beginner', 99, 4.7, ARRAY['Programming', 'Q&A', 'Community']),
('GitHub', 'Code hosting and collaboration platform', 'https://github.com', 'website', 'Development', true, 'beginner', 98, 4.8, ARRAY['Git', 'Code', 'Collaboration']),
('Kaggle', 'Data science competitions and datasets', 'https://kaggle.com', 'website', 'Data Science', true, 'intermediate', 90, 4.6, ARRAY['Data Science', 'ML', 'Competitions']),
('MDN Web Docs', 'Comprehensive web development documentation', 'https://developer.mozilla.org', 'website', 'Web Development', true, 'beginner', 95, 4.8, ARRAY['Web Dev', 'Documentation', 'Mozilla']),
('Hugging Face', 'AI model hub and community', 'https://huggingface.co', 'website', 'AI/ML', true, 'intermediate', 88, 4.7, ARRAY['AI', 'Models', 'Community']);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 