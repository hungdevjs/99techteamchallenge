import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

const limiter = (maxInOneSecond: number = 5) =>
  rateLimit({
    windowMs: 1000,
    max: maxInOneSecond,
    keyGenerator: (req) => `${req.originalUrl}-${req.userId}`,
    handler: (_req: Request, res: Response, _next: NextFunction) => {
      return res.status(429).send("Too many requests");
    },
  });

export default limiter;
