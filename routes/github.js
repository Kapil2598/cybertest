const express = require('express');
const GithubRun = require('../models/GithubRun');
const router = express.Router();

// Save GitHub workflow run metadata to MongoDB
router.post('/run', async (req, res) => {
  try {
    const {
      repository,
      workflow,
      runId,
      runNumber,
      eventName,
      branch,
      commitSha,
      actor,
      status,
      url,
    } = req.body;

    if (!repository || !workflow || !runId) {
      return res.status(400).json({
        error: 'repository, workflow, and runId are required',
      });
    }

    const githubRun = new GithubRun({
      repository,
      workflow,
      runId,
      runNumber,
      eventName,
      branch,
      commitSha,
      actor,
      status,
      url,
    });

    await githubRun.save();
    res.status(201).json(githubRun);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save GitHub run data' });
  }
});

router.get('/runs', async (req, res) => {
  try {
    const runs = await GithubRun.find().sort({ createdAt: -1 }).limit(50);
    res.json(runs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load GitHub runs' });
  }
});

module.exports = router;
