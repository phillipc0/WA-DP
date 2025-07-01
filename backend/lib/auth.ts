import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "24h";

export interface AuthenticatedUser {
  username: string;
}

export interface AuthenticatedRequest extends NextApiRequest {
  user?: AuthenticatedUser;
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user: AuthenticatedUser): string => {
  return jwt.sign({ username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): AuthenticatedUser | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return { username: decoded.username };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

export const authenticateToken = (
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>,
) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const user = verifyToken(token);
    if (!user) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    req.user = user;
    return handler(req, res);
  };
};

export const handleError = (
  res: NextApiResponse,
  error: any,
  defaultMessage: string = "Internal server error",
) => {
  console.error("API Error:", error);
  res.status(500).json({ error: defaultMessage });
};
