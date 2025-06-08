# Sankat Mochan - AI Tools Discovery Platform

**Sankat Mochan** is a comprehensive web application that helps students and developers discover the best AI tools, YouTube channels, courses, and websites based on their search queries. The platform features intelligent search with AI-powered recommendations, user authentication, and a modern responsive UI.

## 🚀 Features

### Core Functionality
- **Smart Search**: AI-powered search for resources with advanced filtering
- **Resource Discovery**: Find AI tools, YouTube channels, courses, and websites
- **User Authentication**: Email/password and Google OAuth login
- **Search Limits**: 5 free searches for guests, unlimited for registered users
- **Search History**: Track and revisit previous searches
- **Responsive Design**: Mobile-friendly interface with modern UI

### Technical Features
- **Backend**: Flask with PostgreSQL and Redis
- **Frontend**: React with TypeScript and Tailwind CSS
- **Authentication**: JWT tokens with secure password hashing
- **Caching**: Redis for search results and rate limiting
- **AI Integration**: OpenAI API for intelligent recommendations
- **Containerization**: Docker and Docker Compose setup

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │◄──►│   (Flask)       │◄──►│  (PostgreSQL)   │
│   Port: 3000    │    │   Port: 5000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │     Redis       │
                       │   (Cache)       │
                       │   Port: 6379    │
                       └─────────────────┘
```

## 📁 Project Structure

```
Sankat_mochan/
├── backend/                 # Flask backend application
│   ├── app/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── config.py           # Configuration settings
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend container config
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   └── types/          # TypeScript types
│   ├── package.json        # Node.js dependencies
│   └── Dockerfile          # Frontend container config
├── docker-compose.yml      # Multi-container setup
├── init.sql               # Database initialization
└── README.md              # Project documentation
```

## 🛠️ Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for local development)
- OpenAI API key (optional, for AI features)
- Google OAuth credentials (optional, for Google login)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Sankat_mochan
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env file with your configuration
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432
   - Redis: localhost:6379

### Local Development Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up database**
   ```bash
   # Start PostgreSQL and Redis (via Docker or locally)
   docker-compose up postgres redis -d
   
   # Run database migrations
   flask db upgrade
   ```

5. **Start the backend server**
   ```bash
   python run.py
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Flask Configuration
SECRET_KEY=your-super-secret-key
JWT_SECRET_KEY=your-jwt-secret-key

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/sankat_mochan

# Redis
REDIS_URL=redis://localhost:6379/0

# OpenAI (Optional)
OPENAI_API_KEY=your-openai-api-key

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

### Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts and profiles
- `search_history` - User search history
- `resources` - AI tools, courses, and other resources
- `user_favorites` - User's favorite resources

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### Search Endpoints
- `POST /api/search` - Search for resources
- `GET /api/search/count` - Get user's search count

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/search-history` - Get search history
- `DELETE /api/user/search-history` - Clear search history

## 🎨 Frontend Features

### Components
- **Header**: Navigation with user menu
- **Footer**: Links and branding
- **SearchPage**: Main search interface with filters
- **LoginPage**: User authentication
- **SignupPage**: User registration
- **ProfilePage**: User dashboard and settings
- **HomePage**: Landing page with features

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Custom Components**: Reusable UI components
- **Dark Mode Ready**: Prepared for dark theme

## 🔒 Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Redis-based request limiting
- **CORS Protection**: Configurable cross-origin requests
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: SQLAlchemy ORM with parameterized queries

## 🚀 Deployment

### Production Deployment

1. **Set production environment variables**
   ```bash
   export FLASK_ENV=production
   export FLASK_CONFIG=production
   ```

2. **Build and deploy with Docker**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Set up reverse proxy (Nginx)**
   - Configure SSL certificates
   - Set up domain routing
   - Enable gzip compression

### Environment-Specific Configurations

- **Development**: Debug mode, verbose logging
- **Production**: Optimized builds, error logging, security headers
- **Testing**: In-memory database, mock services

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📈 Performance Optimization

- **Redis Caching**: Search results and user sessions
- **Database Indexing**: Optimized queries for search
- **Lazy Loading**: Frontend components and images
- **Code Splitting**: Optimized bundle sizes
- **CDN Ready**: Static asset optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@sankatmochan.com
- Documentation: [Wiki](https://github.com/your-repo/wiki)

## 🙏 Acknowledgments

- OpenAI for AI integration capabilities
- Tailwind CSS for the design system
- Flask and React communities for excellent frameworks
- All contributors and users of the platform

---

**Built with ❤️ for the developer and student community** 