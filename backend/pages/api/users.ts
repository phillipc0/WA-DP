import { NextApiRequest, NextApiResponse } from "next";

import {
  generateToken,
  handleError,
  hashPassword,
  verifyPassword,
} from "../../lib/auth";
import {
  createUser,
  findUserByUsername,
  hasAnyUsers,
} from "../../lib/userService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "GET") {
      const userExists = hasAnyUsers();
      res.status(200).json({ exists: userExists });
      return;
    }

    if (req.method === "POST") {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
      }

      const existingUser = findUserByUsername(username);

      if (!existingUser) {
        if (hasAnyUsers()) {
          res.status(409).json({ error: "Admin user already exists" });
          return;
        }

        const hashedPassword = await hashPassword(password);
        createUser(username, hashedPassword);

        const token = generateToken({ username });
        res.status(201).json({
          created: true,
          token,
          user: { username },
        });
        return;
      }

      const isValidPassword = await verifyPassword(
        password,
        existingUser.password,
      );

      if (isValidPassword) {
        const token = generateToken({ username });
        res.status(200).json({
          authenticated: true,
          token,
          user: { username },
        });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    handleError(res, error, "Authentication failed");
  }
}
