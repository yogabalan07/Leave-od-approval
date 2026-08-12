import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type TokenPayload = { userId: string; role: string };

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
}
