# Contributing to decktype

## Getting started

1. **Fork and clone**

   ```bash
   git clone https://github.com/your_username/decktype.git
   cd decktype
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Configure environment**
   create a `.env` file in `apps/backend/` with:

   ```env
   MONGODB_URI=<your_mongodb_uri>
   MONGODB_DB_NAME=decktype
   ```

4. **Start development**

   ```bash
   bun dev
   ```

> envs are managed in `backend/src/config/env.ts` and `frontend/src/lib/urls.ts`.

## Pull requests

- use [conventional commits](https://www.conventionalcommits.org/) for **pr titles**.
- **scopes:** `feat`, `fix`, `refactor`, `chore`, `docs`, `impr`, `style`, `ci`, `perf`.
- **examples:**
  - `feat: implement global leaderboard for daily challenges`
  - `fix: layout shift on results screen during transition`
  - `refactor: optimize word bank generation performance`
