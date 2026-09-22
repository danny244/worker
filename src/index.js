const http = require("node:http");

const PORT = Number(process.env.PORT || 3000);
const WORKER_NAME = process.env.WORKER_NAME || "pipeops-worker-test";
const TICK_INTERVAL_MS = Number(process.env.TICK_INTERVAL_MS || 10000);

let tickCount = 0;
let lastTickAt = null;
const startedAt = new Date();

function log(message, extra = {}) {
  const payload = {
    timestamp: new Date().toISOString(),
    worker: WORKER_NAME,
    message,
    ...extra
  };

  console.log(JSON.stringify(payload));
}

function runJob() {
  tickCount += 1;
  lastTickAt = new Date();

  log("worker tick completed", {
    tickCount,
    lastTickAt: lastTickAt.toISOString()
  });
}

const server = http.createServer((request, response) => {
  if (request.url === "/health") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(
      JSON.stringify({
        status: "ok",
        worker: WORKER_NAME,
        uptimeSeconds: Math.round(process.uptime()),
        startedAt: startedAt.toISOString(),
        tickCount,
        lastTickAt: lastTickAt ? lastTickAt.toISOString() : null
      })
    );
    return;
  }

  response.writeHead(200, { "content-type": "text/plain" });
  response.end(`${WORKER_NAME} is running\n`);
});

server.listen(PORT, () => {
  log("health server listening", { port: PORT });
  runJob();
});

const interval = setInterval(runJob, TICK_INTERVAL_MS);

function shutdown(signal) {
  log("shutdown requested", { signal });
  clearInterval(interval);

  server.close(() => {
    log("shutdown complete");
    process.exit(0);
  });
}

// process
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
