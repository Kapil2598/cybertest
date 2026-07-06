require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const streamRouter = require('./routes/stream');
const githubRouter = require('./routes/github');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

app.use(express.json());

// Basic root route to verify the server is running
app.get('/', (req, res) => {
  res.send('Server running');
});

// Mount API routes
app.use('/api/stream', streamRouter);
app.use('/api/github', githubRouter);

// Connect to MongoDB using Mongoose and start the server
async function startServer() {
  if (!MONGO_URL) {
    console.error('Missing MONGO_URL in environment variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

startServer();
