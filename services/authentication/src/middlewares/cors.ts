import cors from "cors"

export function corsMiddleware() {
    return cors({
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true,
    });
  }