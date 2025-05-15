# Installation Guide

This guide will help you set up and run the Pinterest Clone on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or later)
- **npm** (v6.0.0 or later) or **yarn** (v1.22.0 or later)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/pinterest-clone.git
cd pinterest-clone
```

## Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

## Step 3: Start the Development Server

Using npm:
```bash
npm run dev
```

Or using yarn:
```bash
yarn dev
```

This will start the development server, typically at `http://localhost:5173` (or another port if 5173 is in use).

## Step 4: Access the Application

Open your web browser and navigate to:
```
http://localhost:5173
```

You should now see the Pinterest Clone application running in your browser.

## Troubleshooting

### Port Already in Use

If you see an error like "Port 5173 is already in use", Vite will automatically try the next available port. Look at the terminal output to see which port was selected.

### Dependencies Installation Issues

If you encounter issues during dependency installation:

1. Delete the `node_modules` folder:
   ```bash
   rm -rf node_modules
   ```

2. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

3. Reinstall dependencies:
   ```bash
   npm install
   ```

### Build Issues

If you encounter build issues:

1. Make sure you're using a compatible Node.js version
2. Update your npm or yarn to the latest version
3. Try clearing the Vite cache:
   ```bash
   rm -rf node_modules/.vite
   ```

## Production Build

To create a production build:

```bash
npm run build
# or
yarn build
```

This will generate optimized files in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

## Environment Variables

The application doesn't require any environment variables by default, as it uses mock data. If you integrate with a backend, you might need to set up environment variables.

Create a `.env` file in the root directory:

```
VITE_API_URL=your_api_url_here
```

## Additional Commands

- **Lint code**:
  ```bash
  npm run lint
  # or
  yarn lint
  ```

- **Run tests** (if implemented):
  ```bash
  npm run test
  # or
  yarn test
  ```

## Next Steps

After installation, you might want to:

1. Explore the codebase to understand the structure
2. Modify the sample data in `src/data/pins.ts` to customize content
3. Implement your own backend integration
4. Customize the UI to match your brand

For more details on the project structure and components, refer to the [README.md](./README.md) file.
