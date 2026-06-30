import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async login(req: Request, res: Response) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
      const data = await AuthService.login(username, password);
      return res.status(200).json(data);
    } catch (err: any) {
      return res.status(401).json({ message: err.message || 'Login failed' });
    }
  }

  static async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    try {
      const data = await AuthService.refreshToken(refreshToken);
      return res.status(200).json(data);
    } catch (err: any) {
      return res.status(401).json({ message: err.message || 'Invalid refresh token' });
    }
  }

  static async logout(req: Request, res: Response) {
    // In a stateless JWT system, client deletes the token.
    // For compliance, we return a success response immediately.
    return res.status(200).json({ message: 'Logged out successfully' });
  }
}
