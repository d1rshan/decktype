# Contributing to Decktype

First off, thanks for taking the time to contribute! Decktype is an open-source typing project, and we love to see new faces.

## Prerequisites

- [Bun](https://bun.sh/) (Runtime & Package Manager)
- [MongoDB](https://www.mongodb.com/docs/manual/installation/) (Running locally or a cloud instance)

## Getting Started

1. **Fork and Clone** the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/decktype.git
   cd decktype
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Set up Environment Variables**:
   Copy the example environment file in the backend app:
   
   **Backend:**
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   ```
   
   *Note: The frontend works out of the box with defaults (pointing to localhost:3000). You only need to set up the backend environment.*

4. **Run the development server**:
   ```bash
   bun dev
   ```
   This will start both the backend (port 3000) and the frontend (port 5173).

## Development Workflow

### Project Structure
- `apps/backend`: Elysia server with MongoDB.
- `apps/frontend`: SolidJS application with Vite and Tailwind CSS.
- `packages/api`: Shared types and API client.

### Linting & Formatting
We use `oxlint` for linting and `oxfmt` for formatting. They are blazingly fast!
```bash
# Format code
bun run format

# Run linter
bun run lint

# Type check
bun run typecheck
```

## Submitting a Pull Request

1. Create a new branch for your feature or bugfix: `git checkout -b feat/my-cool-feature`.
2. Commit your changes. We follow [Conventional Commits](https://www.conventionalcommits.org/).
3. Push to your fork and open a Pull Request.
4. Provide a clear description of what you've changed and why.

## Need Help?

If you have questions or get stuck, feel free to open an issue or reach out to the maintainers.

Happy coding! 🚀
