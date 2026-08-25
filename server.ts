import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { config } from "dotenv";
import { authRouter } from "./server/auth";
import { apiRouter } from "./server/api";
import { webhooksRouter } from "./server/webhooks";
import { aiRouter } from "./server/ai";

config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = express();

  // Basic middleware
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api", apiRouter);
  app.use("/api/webhooks", webhooksRouter);
  app.use("/api/ai", aiRouter);

  // Vite middleware for development

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
