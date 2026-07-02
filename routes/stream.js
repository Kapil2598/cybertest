const express = require('express');
const router = express.Router();

// Streaming endpoint: sends a chunk every second for 5 seconds.
router.get('/', async (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  let count = 0;
  const maxChunks = 5;

  const interval = setInterval(() => {
    count += 1;
    res.write(`Chunk ${count} of ${maxChunks}\n`);

    if (count === maxChunks) {
      clearInterval(interval);
      res.write('Stream finished\n');
      res.end();
    }
  }, 1000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

module.exports = router;
