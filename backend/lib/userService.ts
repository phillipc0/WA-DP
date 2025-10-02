import fs from "fs";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

export interface StoredUser {
  username: string;
  password: string; // This will be hashed
}

export const getUsersFromFile = (): StoredUser[] => {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(USERS_FILE, "utf8");
    const parsed = JSON.parse(data);

    if (Array.isArray(parsed)) {
      return parsed;
    } else if (parsed.username && parsed.password) {
      return [parsed];
    }
    return [];
  } catch (error) {
    console.error("Error reading users file:", error);
    return [];
  }
};

export const saveUsersToFile = (users: StoredUser[]): void => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error writing users file:", error);
    throw new Error("Failed to save user data");
  }
};

export const findUserByUsername = (username: string): StoredUser | null => {
  const users = getUsersFromFile();
  return users.find((user) => user.username === username) || null;
};

export const createUser = (
  username: string,
  hashedPassword: string,
): StoredUser => {
  const newUser: StoredUser = { username, password: hashedPassword };

  saveUsersToFile([newUser]);

  return newUser;
};

export const hasAnyUsers = (): boolean => {
  const users = getUsersFromFile();
  return users.length > 0;
};
