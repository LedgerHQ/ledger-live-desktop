import "dotenv/config";

process.env = {
  ...process.env,
  // FIXME: needed to build a workable test bundle of the app, to be removed one backend API is in prod
  SWAP_API_BASE: "https://swap.aws.stg.ldg-tech.com/v3",
  NODE_ENV: (process.env || {}).NODE_ENV || "production",
};
