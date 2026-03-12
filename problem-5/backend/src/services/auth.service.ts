import jwt from "jsonwebtoken";

import User from "../models/user.model";
import { comparePassword } from "../utils/password";
import environments from "../utils/environments";

const { JWT_SECRET_KEY, JWT_LIFE_TIME } = environments;

export const login = async (username: string, password: string) => {
  const user = await User.findOne({ username }).lean();

  if (!user) throw new Error("Bad credentials");

  const isPasswordMatch = await comparePassword(password, user.password);
  if (!isPasswordMatch) throw new Error("Bad credentials");

  const token = jwt.sign(
    { sub: user._id.toString() },
    JWT_SECRET_KEY as string,
    {
      expiresIn: JWT_LIFE_TIME as any,
    },
  );

  return { token, user: { id: user._id.toString(), username } };
};
