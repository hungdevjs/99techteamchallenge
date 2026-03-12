import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import environments from "../utils/environments";

const { JWT_SECRET_KEY } = environments;

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("Bad credentials");

    const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as JwtPayload;

    req.userId = decoded.sub;
    next();
  } catch (err) {
    console.error(err);
    return res.sendStatus(401);
  }
};

export default authMiddleware;
