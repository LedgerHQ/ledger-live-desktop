import "dotenv/config";

process.env = {
  ...process.env,
  NODE_ENV: (process.env || {}).NODE_ENV || "production",
};
