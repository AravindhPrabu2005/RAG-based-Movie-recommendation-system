const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { ChromaClient } = require('chromadb');
const { DefaultEmbeddingFunction } = require('@chroma-core/default-embed');
const Groq = require('groq-sdk');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/movieapp';

const CHROMA_HOST = process.env.CHROMA_HOST || 'localhost';
const CHROMA_PORT = process.env.CHROMA_PORT || 8000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

let movieCollection;

const groq = new Groq({
  apiKey: GROQ_API_KEY
});

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const initChroma = async () => {
  try {
    const chromaClient = new ChromaClient({
      path: `http://${CHROMA_HOST}:${CHROMA_PORT}`
    });

    const embedder = new DefaultEmbeddingFunction();

    movieCollection = await chromaClient.getOrCreateCollection({
      name: 'movies_v2',
      embeddingFunction: embedder
    });

    console.log('✅ ChromaDB connected successfully');
  } catch (error) {
    console.error('❌ ChromaDB connection error:', error.message);
  }
};

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    genre: {
      type: String,
      required: true
    },
    cast: {
      type: [String],
      default: []
    },
    director: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: ''
    },
    posterUrl: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Movie = mongoose.model('Movie', movieSchema);

app.get('/', (req, res) => {
  res.json({ message: 'Movie API is running' });
});

app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching movies',
      error: error.message
    });
  }
});

app.post('/api/movies', async (req, res) => {
  try {
    console.log('Incoming body:', req.body);

    const normalizedBody = {
      ...req.body,
      cast: Array.isArray(req.body.cast)
        ? req.body.cast
        : typeof req.body.cast === 'string'
        ? req.body.cast.split(',').map((item) => item.trim()).filter(Boolean)
        : [],
      year: Number(req.body.year),
      rating: Number(req.body.rating) || 0
    };

    const movie = new Movie(normalizedBody);
    const savedMovie = await movie.save();

    if (movieCollection) {
      const chromaDocument = `
Movie Name: ${savedMovie.name}
Year: ${savedMovie.year}
Description: ${savedMovie.description}
Genre: ${savedMovie.genre}
Cast: ${savedMovie.cast.join(', ')}
Director: ${savedMovie.director}
Language: ${savedMovie.language}
Rating: ${savedMovie.rating}
      `.trim();

      await movieCollection.upsert({
        ids: [savedMovie._id.toString()],
        documents: [chromaDocument],
        metadatas: [
          {
            name: savedMovie.name,
            year: savedMovie.year,
            genre: savedMovie.genre,
            director: savedMovie.director || '',
            language: savedMovie.language || '',
            rating: savedMovie.rating || 0
          }
        ]
      });
    }

    res.status(201).json({
      message: 'Movie uploaded successfully',
      movie: savedMovie
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error uploading movie',
      error: error.message
    });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: 'User message is required'
      });
    }

    if (!movieCollection) {
      return res.status(500).json({
        message: 'Chroma collection is not initialized'
      });
    }

    const results = await movieCollection.query({
      queryTexts: [message],
      nResults: 5
    });

    const retrievedDocs = results.documents?.[0] || [];
    const retrievedMetadatas = results.metadatas?.[0] || [];
    const retrievedIds = results.ids?.[0] || [];

    const matchedMovies = retrievedDocs.map((doc, index) => ({
      id: retrievedIds[index],
      document: doc,
      metadata: retrievedMetadatas[index]
    }));

    const contextText = matchedMovies
      .map((movie, index) => {
        return `Movie ${index + 1}:
${movie.document}
Metadata: ${JSON.stringify(movie.metadata)}`;
      })
      .join('\n\n');

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content: `You are a movie recommendation assistant.
Your job is to recommend movies only from the retrieved database context.
Do not invent movies outside the provided context.
Answer in this format:
1. A short friendly intro
2. Recommended movies as bullet points
3. For each movie, mention why it matches the user's preference
4. End with a short conclusion`
        },
        {
          role: 'user',
          content: `User query:
${message}

Retrieved movie database context:
${contextText}`
        }
      ]
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      'Sorry, I could not generate a recommendation right now.';

    res.status(200).json({
      reply,
      matches: matchedMovies
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error generating chat response',
      error: error.message
    });
  }
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await initChroma();
});