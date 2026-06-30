import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initDB } from './server/config/db';
import { AuthService } from './server/services/auth.service';
import apiRoutes from './server/routes/api.routes';
import { errorHandler } from './server/middlewares/error.middleware';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  // Initialize DB and Seed default credentials
  await initDB();
  await AuthService.seedDefaultAdmin();

  // Basic Security & Logger Middlewares
  app.use(cors());
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disabled for flexible loading of high-fidelity images/external assets
      crossOriginEmbedderPolicy: false,
    })
  );
  app.use(morgan('dev'));

  // Body Parsing configuration with elevated limits to support backups/JSON dumps
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Static files inside public (like amc_backup.json and uploads)
  app.use(express.static(path.join(process.cwd(), 'public')));

  // REST API Routes
  app.use('/api', apiRoutes);

  // Error Handler Middleware
  app.use(errorHandler);

  // Vite Single Page Application middleware injection
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('AMC Backend: Vite development middleware integrated.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('AMC Backend: Serving built production files from /dist.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=========================================`);
    console.log(`  AMC BEKASI FULL-STACK SERVER STARTED  `);
    console.log(`  URL: http://0.0.0.0:${PORT}            `);
    console.log(`=========================================`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
});
