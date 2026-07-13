# RAG-based Movie Recommendation System

An intelligent movie recommendation system powered by Retrieval-Augmented Generation (RAG) technology. This application combines modern web technologies with AI capabilities to provide personalized movie recommendations based on user preferences and descriptions.

## Overview

This system uses a RAG approach with vector embeddings and language models to understand user queries and recommend relevant movies. It features a React-based frontend, Node.js/Express backend, and ChromaDB for vector storage.

## Tech Stack

### Frontend
- **React** (v19.2.6) - UI framework
- **React Router** (v7.15.1) - Client-side routing
- **Axios** - HTTP client for API communication
- **Tailwind CSS** - Styling framework
- **Testing Library** - Component testing

### Backend
- **Express.js** (v5.2.1) - Web framework
- **Node.js** - Runtime environment
- **Groq SDK** - AI model integration
- **ChromaDB** (v3.4.3) - Vector database
- **Mongoose** (v9.6.2) - MongoDB ODM
- **Nodemon** - Development server with auto-reload

### Infrastructure
- **Chroma Embeddings** - Vector embeddings generation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Project Structure

```
├── client/              # React frontend application
│   ├── package.json
│   ├── public/
│   └── src/
├── server/              # Express.js backend
│   ├── package.json
│   └── server.js
└── infra/               # Infrastructure configuration
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for data persistence)
- Groq API key (for LLM integration)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/AravindhPrabu2005/RAG-based-Movie-recommendation-system.git
cd RAG-based-Movie-recommendation-system
```

2. **Setup Backend**
```bash
cd server
npm install
```

3. **Setup Frontend**
```bash
cd ../client
npm install
```

### Configuration

Create a `.env` file in the `server` directory:
```
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### Running the Application

**Terminal 1 - Start Backend**
```bash
cd server
npm start
```
The server will run on `http://localhost:5000` with nodemon for auto-reload on changes.

**Terminal 2 - Start Frontend**
```bash
cd client
npm start
```
The React app will open at `http://localhost:3000`

## Features

- **RAG-Powered Recommendations** - Uses vector embeddings and retrieval to understand movies and user preferences
- **AI Chat Interface** - Natural language queries for movie recommendations
- **Vector Database** - ChromaDB for efficient similarity search
- **Modern UI** - Responsive React frontend with Tailwind CSS styling
- **REST API** - RESTful backend with Express.js
- **Database Integration** - MongoDB for persistent data storage

## API Endpoints

The backend provides various endpoints for movie recommendations and user interactions. Key endpoints include:
- Movie search and retrieval
- Recommendation generation
- User preference management

## Available Scripts

### Frontend (`client/`)
- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Backend (`server/`)
- `npm start` - Run server with nodemon
- `npm test` - Run tests

## Development

This project is built with modern JavaScript (ES6+) and follows a client-server architecture:
- **84.5%** JavaScript
- **8.6%** HTML
- **6.9%** CSS

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC License - feel free to use this project as per the license terms.

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Built by Aravindhprabu2005**
