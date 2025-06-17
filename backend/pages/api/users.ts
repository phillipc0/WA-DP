import fs from "fs";
import path from "path";

import { NextApiRequest, NextApiResponse } from "next";

const USERS_FILE = path.join(process.cwd(), "users.json");

type User = {
  username: string;
  password: string;
};

function readUser(): User | null {
  if (fs.existsSync(USERS_FILE)) {
    try {
      const data = fs.readFileSync(USERS_FILE, "utf-8");

      return JSON.parse(data) as User;
    } catch {
      return null;
    }
  }

  return null;
}

function writeUser(user: User) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(user), "utf-8");
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = readUser();

  if (req.method === "GET") {
    res.status(200).json({ exists: !!user });

    return;
  }

  if (req.method === "POST") {
    const { username, password } = req.body as Partial<User>;

    if (!username || !password) {
      res.status(400).json({ message: "missing credentials" });

      return;
    }
    if (!user) {
      writeUser({ username, password });
      res.status(200).json({ created: true });

      return;
    }
    if (user.username === username && user.password === password) {
      res.status(200).json({ authenticated: true });
    } else {
      res.status(401).json({ authenticated: false });
    }

    return;
  }

  res.status(405).end();
}
