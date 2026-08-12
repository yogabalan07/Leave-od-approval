import "./config/env";
import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

async function start() {
  try {
    await connectDatabase();
    app.listen(env.port, () => console.log(`🚀 API: http://localhost:${env.port}`));
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

start();
