/* eslint-disable no-console */
import http from "http";
import App from "../app";

const app = new App();
const { host } = app;

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || "5000");
host.set("port", port);

/**
 * Create HTTP server.
 */
const server = http.createServer(host);

/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = () => {
  const addr = server.address();
  const bind =
    typeof addr === "string"
      ? `pipe ${addr}`
      : `port ${addr ? addr.port : port}`;
  console.log(`Listening on ${bind}`);
};

(async () => {
  try {
    await app.connect();
    app.init();

    // Listen on provided port, on all network interfaces.
    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);
  } catch (error) {
    console.log("error boot app: ", error);
  }
})();

/**
 * Event listener for process "exit" event.
 */
const onShutdown = (signal) => {
  const exitCode = signal === "uncaughtException" ? 1 : 0;
  console.log(`Server stop running.. Receiving Signal: ${signal}`);
  server.close(() => {
    process.exit(exitCode);
  });
};

process
  .on("SIGTERM", onShutdown)
  .on("SIGINT", onShutdown)
  .on("uncaughtException", onShutdown);

process.on("exit", (code) => {
  console.log(`Server is going to exit with code: ${code}`);
});

export default server;
