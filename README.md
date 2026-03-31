# 🚀 AI Tech Stack Recommender

An intelligent web application that transforms raw project ideas into complete, production-ready technology stack recommendations using Google's Gemini AI.

![Tech Stack Recommender](https://img.shields.io/badge/AI-Powered-blue)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688)
![Gemini](https://img.shields.io/badge/Gemini-AI%20Model-4285F4)

## ✨ Features

### 🤖 AI-Powered Recommendations
- **Smart Tech Stack Generation**: Converts natural language ideas into optimized technology stacks
- **System Architecture**: Visual architecture diagrams with AI pipeline visualization
- **Deployment Strategies**: Cloud platform recommendations with CI/CD guidance
- **Development Roadmap**: Timeline-style project planning with actionable steps

### 🎨 Premium UI/UX
- **Modern Dashboard**: Clean, dark-themed SaaS interface
- **Card-Based Layout**: Organized sections for architecture, technologies, deployment, and roadmap
- **Visual Architecture Diagram**: Flow-based system visualization
- **Categorized Technology Tags**: Color-coded by frontend, backend, database, AI/ML, and DevOps
- **Timeline Roadmap**: Numbered phases with progress indicators
- **Responsive Design**: Works on desktop and mobile

### 🛡️ Fault-Tolerant Backend
- **AI-First Processing**: Prioritizes AI-generated content, fallback only as last resort
- **Retry Logic**: Automatic retry for Gemini API calls
- **Safe JSON Parsing**: Handles malformed responses gracefully
- **Smart Caching**: Redis and in-memory caching for performance
- **Error Handling**: Never crashes, always returns valid JSON

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool

### Backend
- **FastAPI** - High-performance Python framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL** - Production database
- **Redis** - Caching layer
- **Google Generative AI (Gemini)** - LLM integration

### AI/ML
- **Gemini 2.5 Flash** - Primary LLM model
- **Prompt Engineering** - Structured, context-aware prompts
- **JSON Normalization** - Reliable response parsing

## 📸 Screenshots

<img width="1887" height="913" alt="image" src="https://github.com/user-attachments/assets/e9d33cd8-c977-47de-9ed4-e99361d44614" />
<img width="1899" height="923" alt="image" src="https://github.com/user-attachments/assets/7883705f-82ef-4a02-b366-6e45360aa13f" />
<img width="1041" height="860" alt="image" src="https://github.com/user-attachments/assets/4da06a6a-9648-4199-b46c-84ebc0fd6a2a" />


## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (optional, SQLite works for dev)
- Redis (optional, in-memory cache works for dev)
- Google Gemini API Key

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/shreyad2806/Ai-tech-stack-recommender.git
cd Ai-tech-stack-recommender

# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo GEMINI_API_KEY=your_api_key_here > .env
echo GEMINI_MODEL=gemini-2.5-flash >> .env

# Run the server
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

Frontend runs at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
DATABASE_URL=postgresql://user:password@localhost:5432/techstackdb  # Optional
REDIS_URL=redis://localhost:6379  # Optional
```

## 📖 How It Works

1. **Input Your Idea**: Enter a project concept (e.g., "AI-powered marketing platform")
2. **AI Processing**: Gemini analyzes the idea and generates recommendations
3. **View Results**:
   - **Architecture**: System design and component overview
   - **Technologies**: Categorized stack recommendations
   - **Deployment**: Cloud strategy and CI/CD setup
   - **Roadmap**: Phased development plan
4. **Save & Iterate**: Store recommendations and refine your idea

## 🎯 Example Use Cases

- **Startup Founders**: Validate technical feasibility before building
- **Students**: Learn real-world system design patterns
- **Hackathon Teams**: Decide stacks quickly under time pressure
- **Developers**: Plan scalable architectures for new projects
- **Product Managers**: Understand technical requirements

## 🔧 Project Structure

```
AiTechStackRecommender/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── database.py          # Database models & config
│   ├── requirements.txt     # Python dependencies
│   └── .env                # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── InputBox.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ArchitectureDiagram.jsx
│   │   ├── pages/        # Page components
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🛠️ Development

### Backend Development
```bash
cd backend
uvicorn main:app --reload --log-level debug
```

### Frontend Development
```bash
cd frontend
npm run dev
```

## 📝 API Endpoints

- `POST /recommend` - Generate tech stack from idea
- `POST /recommend-stream` - Streaming response
- `POST /save-stack` - Save recommendation to database
- `GET /stacks` - Retrieve saved recommendations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini API for powering the AI recommendations
- React and FastAPI communities for excellent documentation
- Open source contributors

---

Built with ❤️ by [Shreya Dubey](https://github.com/shreyad2806)
