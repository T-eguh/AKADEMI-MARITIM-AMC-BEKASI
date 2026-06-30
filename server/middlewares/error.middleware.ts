import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('AMC Backend Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    status: 'error',
    message,
    // Avoid leaking stack traces in production
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}
