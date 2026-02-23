import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import router from "./api/v1/routes";
import { HTTP_STATUS } from "./constants/httpConstants";
import { NotFoundError } from "./api/v1/services/eventService";

const app: Express = express();

app.use(express.json());
app.use(morgan("combined"));

// optional root route
app.get("/", (req, res) => res.send("Event Registration API"));

// API v1 routes
app.use("/api/v1", router);

// Error handler (important for clean API responses)
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  const message = err instanceof Error ? err.message : "Unknown error";
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: message });
});

export default app;