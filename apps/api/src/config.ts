import { CorsOptions } from "cors";
import { config } from "dotenv";
import { resolve } from "path";

export const NODE_ENV = process.env.NODE_ENV || "development";

const envFile = NODE_ENV === "development" ? ".env.local" : ".env";

config({ path: resolve(__dirname, `../${envFile}`) });
config({ path: resolve(__dirname, `../${envFile}.local`), override: true });

// CORS origin dinamis dari env, support multi-origin (pisah koma)
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:3000"];
export const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

// Load all environment variables from .env file

export const PORT = process.env.PORT || 8000;
export const DATABASE_URL = process.env.DATABASE_URL || "";

// nodemailer config
export const NODEMAILER_USER = process.env.NODEMAILER_USER;
export const NODEMAILER_PASS = process.env.NODEMAILER_PASS;

// jwt config
export const JWT_ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || " ";
export const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || " ";

// nodemailer config
export const node_account = {
  user: process.env.NODEMAILER_USER || "",
  pass: process.env.NODEMAILER_PASS || "",
};
