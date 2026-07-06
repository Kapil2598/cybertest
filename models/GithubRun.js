const mongoose = require('mongoose');

const githubRunSchema = new mongoose.Schema({
  repository: { type: String, required: true },
  workflow: { type: String, required: true },
  runId: { type: String, required: true },
  runNumber: { type: Number },
  eventName: { type: String },
  branch: { type: String },
  commitSha: { type: String },
  actor: { type: String },
  status: { type: String, default: 'success' },
  url: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('GithubRun', githubRunSchema);
