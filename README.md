# Express Mongoose Stream App

A simple Express.js application with MongoDB integration and a streaming endpoint, wired into a GitHub Actions CI/CD pipeline.

## Features

- Express-based API server
- MongoDB connection via Mongoose
- Streaming endpoint at `/api/stream/`
- GitHub Actions workflow for:
  - install
  - test
  - smoke test
  - packaging
  - optional SSH deployment

## Project Structure

- `app.js` - main Express application and MongoDB connection logic
- `routes/stream.js` - streaming API route
- `package.json` - app metadata, dependencies, and scripts
- `.github/workflows/pipeline.yml` - GitHub Actions CI/CD workflow

## Prerequisites

- Node.js 18+ installed
- npm installed
- MongoDB connection URL for running locally or in CI
- For deployment: SSH access to the target server and required secrets configured in GitHub

## Setup

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with:

```env
MONGO_URL=mongodb://127.0.0.1:27017/your_database
PORT=3000
```

4. Start the app:

```bash
npm start
```

5. Open the root endpoint:

```bash
http://localhost:3000/
```

6. Test the stream endpoint:

```bash
http://localhost:3000/api/stream/
```

## API Endpoints

### `GET /`

Returns a simple message confirming the server is running.

### `GET /api/stream/`

Returns a text stream with one chunk per second for 5 seconds.

Example output:

```text
Chunk 1 of 5
Chunk 2 of 5
Chunk 3 of 5
Chunk 4 of 5
Chunk 5 of 5
Stream finished
```

### `POST /api/github/run`

Saves a GitHub workflow run record into MongoDB. Example request body:

```json
{
  "repository": "owner/repo",
  "workflow": "Node.js CI/CD",
  "runId": "123456789",
  "runNumber": 42,
  "eventName": "push",
  "branch": "main",
  "commitSha": "abcd1234",
  "actor": "github-user",
  "status": "success",
  "url": "https://github.com/owner/repo/actions/runs/123456789"
}
```

### `GET /api/github/runs`

Returns saved GitHub workflow run records from MongoDB.

## Scripts

- `npm start` - runs `node app.js`
- `npm test` - runs syntax checks on `app.js` and `routes/stream.js`

## GitHub run persistence

This project now includes a GitHub run persistence endpoint and a workflow helper script.

- `POST /api/github/run` stores GitHub Actions run metadata in MongoDB.
- `GET /api/github/runs` retrieves recent run records.
- `scripts/saveGithubRun.js` can be executed in a CI/CD environment to save the current run details automatically.

## GitHub Actions Workflow

The workflow is defined in `.github/workflows/pipeline.yml` and includes the following jobs:

### `ci`

- Uses `ubuntu-latest`
- Starts a MongoDB service container for tests
- Installs dependencies with `npm ci`
- Runs `npm test`
- Starts the application and performs a smoke test against `http://127.0.0.1:3000/`
- Packages the repository into `artifact/app.tar.gz`
- Uploads the artifact for later deployment

### `deploy`

- Runs only on the `main` branch and not on pull requests
- Downloads the built artifact
- Deploys over SSH if repository secrets are configured
- Copies the artifact to the remote host and installs production dependencies
- Writes `MONGO_URL` and `PORT` to `.env` on the remote server
- Optionally restarts the app with `pm2` if available

## GitHub Secrets for Deployment

Add these secrets in GitHub repository settings if you want automatic deployment:

- `SSH_HOST`
- `SSH_USER`
- `SSH_KEY`
- `APP_DIR`
- `MONGO_URL`
- `PORT`

If any secret is missing, the deploy step will skip deployment.

## Notes

- The current CI workflow is already configured and validated by `npm test`.
- Streaming is implemented in `routes/stream.js` with chunked response delivery.
- The app requires a valid `MONGO_URL` in `.env` to start locally.

## Troubleshooting

- If the app fails to start, verify `MONGO_URL` in `.env`.
- If the GitHub workflow fails, inspect the workflow logs in Actions and ensure dependencies are installed.
- For SSH deployment issues, confirm the server allows key-based SSH and that the secrets are correct.
