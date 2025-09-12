import express from 'express';
import { registerRoutes } from '../server/routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register all API routes
await registerRoutes(app);

// Export the Express app for Vercel
export default app;
