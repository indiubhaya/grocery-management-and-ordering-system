import type { Request, Response, NextFunction } from 'express';

export function ErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err.message);

  res.status(400).json({
    error: err.message
  });
}
