const IS_PROD = import.meta.env.PROD;

const PROD_FRONTEND_URL = "https://decktype.pages.dev";
const DEV_FRONTEND_URL = "http://localhost:5173";

const PROD_BACKEND_URL = PROD_FRONTEND_URL;
const DEV_BACKEND_URL = "http://localhost:3000";

const GITHUB_REPO = "https://github.com/d1rshan/decktype";

export const urls = {
  frontend: IS_PROD ? PROD_FRONTEND_URL : DEV_FRONTEND_URL,
  backend: IS_PROD ? PROD_BACKEND_URL : DEV_BACKEND_URL,
  github: GITHUB_REPO,
} as const;
