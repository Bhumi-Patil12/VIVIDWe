# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Run the project

- Install dependencies at the root:
  ```bash
  npm install
  ```
- Install backend dependencies:
  ```bash
  cd backend
  npm install
  ```
- Start the frontend:
  ```bash
  npm run dev
  ```
- Start the backend:
  ```bash
  npm run backend
  ```

### Clerk configuration

The frontend uses Clerk for authentication. Create a root `.env` file with your publishable key:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

Then restart the frontend server.
