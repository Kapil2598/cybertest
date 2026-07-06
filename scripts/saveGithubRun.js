require('dotenv').config();
const mongoose = require('mongoose');
const GithubRun = require('../models/GithubRun');

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error('MONGO_URL environment variable is required');
  process.exit(1);
}

const payload = {
  repository: process.env.GITHUB_REPOSITORY,
  workflow: process.env.GITHUB_WORKFLOW,
  runId: process.env.GITHUB_RUN_ID,
  runNumber: Number(process.env.GITHUB_RUN_NUMBER) || undefined,
  eventName: process.env.GITHUB_EVENT_NAME,
  branch: process.env.GITHUB_REF_NAME || process.env.GITHUB_REF,
  commitSha: process.env.GITHUB_SHA,
  actor: process.env.GITHUB_ACTOR,
  status: process.env.GITHUB_STATUS || 'success',
  url:
    process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : undefined,
};

if (!payload.repository || !payload.workflow || !payload.runId) {
  console.error('Missing required GitHub metadata. Ensure GITHUB_REPOSITORY, GITHUB_WORKFLOW, and GITHUB_RUN_ID are available.');
  process.exit(1);
}

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    const githubRun = new GithubRun(payload);
    await githubRun.save();
    console.log('GitHub run saved:', githubRun._id.toString());
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to save GitHub run data:', error);
    process.exit(1);
  });
