const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// List saved messages from MongoDB
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(50);
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

// Save a new message to MongoDB
router.post('/', async (req, res) => {
  try {
    const text = req.body?.text || 'Hello from Express';
    const message = new Message({ text });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

module.exports = router;
