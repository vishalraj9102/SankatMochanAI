# SankatMochanAI
SankatMochan.ai is a platform designed to help developers easily discover AI tools for coding. This project uses React for the frontend, Flask for the backend, PostgreSQL for the database, and Redis for caching, all containerized using Docker. The goal is to provide a seamless user experience in finding and using AI tools

SankatMochan.ai/
├── backend/                          # Backend related code (Flask API)
│   ├── app/                          # Flask app folder
│   │   ├── __init__.py               # Initialize the Flask app
│   │   ├── routes.py                 # Define all API routes
│   │   ├── models.py                 # Database models (PostgreSQL)
│   │   ├── utils.py                  # Utility functions (e.g., Redis caching)
│   ├── Dockerfile                    # Dockerfile for backend container
│   ├── requirements.txt              # Python dependencies
│   ├── config.py                     # Configuration settings (e.g., DB connection)
├── frontend/                         # Frontend related code (React app)
│   ├── public/                       # Public files (e.g., index.html)
│   ├── src/                          # React source code
│   │   ├── components/               # Reusable React components
│   │   ├── pages/                    # Pages like Home, About, etc.
│   │   ├── App.js                    # Main React app
│   │   ├── index.js                  # Entry point for React
│   ├── Dockerfile                    # Dockerfile for frontend container
│   ├── package.json                  # NPM dependencies
│   ├── .env                          # Environment variables (e.g., API URLs)
├── docker-compose.yml                # Docker Compose to manage all services (backend, frontend, DB, Redis)
├── .gitignore                        # Ignore unnecessary files from Git
├── README.md                         # Project description, setup instructions, etc.
└── requirements.txt                  # Common dependencies for both frontend and backend (if needed)



