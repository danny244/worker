# PipeOps Worker Test

A very small Node.js worker project for testing deployment on PipeOps.

It does two things:

- Runs a background job on an interval and writes structured JSON logs.
- Exposes a tiny HTTP server so the deployment can be health checked.

## Run Locally

```bash
npm start
```

Open:

```text
http://localhost:3000/health
```

## Environment Variables

| Name | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | HTTP port for the health server. PipeOps may provide this automatically. |
| `WORKER_NAME` | `pipeops-worker-test` | Name included in logs and health responses. |
| `TICK_INTERVAL_MS` | `10000` | How often the background job runs. |

## PipeOps Deployment Notes

Use either the Node.js runtime or Docker deployment.

For a Node.js service:

```bash
npm start
```

For Docker:

```bash
docker build -t pipeops-worker-test .
docker run -p 3000:3000 pipeops-worker-test
```

Health check path:

```text
/health
```
