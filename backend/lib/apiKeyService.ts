import fs from "fs";
import path from "path";
import crypto from "crypto";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");
const ENV_FILE = path.join(process.cwd(), ".env.local");

// Generate a secure random encryption key
const generateEncryptionKey = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

// Initialize or load encryption key
const initializeEncryptionKey = (): string => {
  // Check if ENCRYPTION_KEY is already set in environment
  if (process.env.ENCRYPTION_KEY) {
    return process.env.ENCRYPTION_KEY;
  }

  // Check if .env.local exists and has ENCRYPTION_KEY
  if (fs.existsSync(ENV_FILE)) {
    const envContent = fs.readFileSync(ENV_FILE, "utf8");
    const keyMatch = envContent.match(/^ENCRYPTION_KEY=(.+)$/m);
    if (keyMatch && keyMatch[1]) {
      // Set it in process.env for this session
      process.env.ENCRYPTION_KEY = keyMatch[1];
      return keyMatch[1];
    }
  }

  // Generate new key and save to .env.local
  const newKey = generateEncryptionKey();
  const envContent = fs.existsSync(ENV_FILE)
    ? fs.readFileSync(ENV_FILE, "utf8") + "\n"
    : "# Auto-generated environment variables\n";

  const newEnvContent = envContent + `ENCRYPTION_KEY=${newKey}\n`;
  fs.writeFileSync(ENV_FILE, newEnvContent);

  // Set it in process.env for this session
  process.env.ENCRYPTION_KEY = newKey;

  return newKey;
};

const ENCRYPTION_KEY = initializeEncryptionKey();

// Encrypt API key
export const encryptApiKey = (apiKey: string): string => {
  const algorithm = "aes-256-cbc";
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(apiKey, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
};

// Decrypt API key
export const decryptApiKey = (encryptedApiKey: string): string => {
  const algorithm = "aes-256-cbc";
  const [ivHex, encryptedData] = encryptedApiKey.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

// Function to save API key securely in user data
export const saveApiKey = (username: string, apiKey: string): void => {
  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    const encryptedKey = encryptApiKey(apiKey);

    const userIndex = users.findIndex(
      (user: any) => user.username === username,
    );
    if (userIndex !== -1) {
      users[userIndex].geminiApiKey = encryptedKey;
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error saving API key:", error);
    throw new Error("Failed to save API key");
  }
};

// Function to get API key securely from user data
export const getApiKey = (username: string): string | null => {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
      const user = users.find((user: any) => user.username === username);

      if (user && user.geminiApiKey) {
        return decryptApiKey(user.geminiApiKey);
      }
    }
    return null;
  } catch (error) {
    console.error("Error reading API key:", error);
    return null;
  }
};

// Function to delete API key from user data
export const deleteApiKey = (username: string): void => {
  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));

    const userIndex = users.findIndex(
      (user: any) => user.username === username,
    );
    if (userIndex !== -1) {
      delete users[userIndex].geminiApiKey;
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error deleting API key:", error);
    throw new Error("Failed to delete API key");
  }
};
