import { Request, Response, NextFunction } from 'express';

export function validateNews(req: Request, res: Response, next: NextFunction) {
  const { title, excerpt, content } = req.body;
  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    return res.status(400).json({ message: 'Title is required and must be at least 3 characters long.' });
  }
  if (!content || typeof content !== 'string' || content.trim().length < 10) {
    return res.status(400).json({ message: 'Content is required and must be at least 10 characters long.' });
  }
  next();
}

export function validateProduct(req: Request, res: Response, next: NextFunction) {
  const { name, price, category } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Product name is required.' });
  }
  if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
    return res.status(400).json({ message: 'Product price must be a positive number.' });
  }
  if (!category) {
    return res.status(400).json({ message: 'Product category is required.' });
  }
  next();
}

export function validateOrder(req: Request, res: Response, next: NextFunction) {
  const { customerName, customerPhone, customerEmail, items } = req.body;
  if (!customerName || !customerPhone || !customerEmail) {
    return res.status(400).json({ message: 'Customer details (name, phone, email) are required.' });
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order items must be a non-empty array.' });
  }
  next();
}

export function validateUser(req: Request, res: Response, next: NextFunction) {
  const { username, name, email, role } = req.body;
  if (!username || username.trim().length < 3) {
    return res.status(400).json({ message: 'Username is required and must be at least 3 characters.' });
  }
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: 'Name is required.' });
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'A valid email address is required.' });
  }
  if (!role) {
    return res.status(400).json({ message: 'Role is required.' });
  }
  next();
}
