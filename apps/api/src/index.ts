import { buildServer } from "./server.js";

const app = await buildServer();
const { HOST, PORT } = app.config;

try {
  await app.listen({ host: HOST, port: PORT });
  app.log.info(`API listening on http://${HOST}:${PORT}`);
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
