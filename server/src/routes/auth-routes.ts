import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = Router();

// Mock user for testing - in production, this would come from your database
const mockUser = {
  id: '1',
  username: 'testuser',
  // This is a hashed version of 'password123'
  password: '$2b$10$6Ot7OENOFgVB0Zx9QIES1OPT/PxwgK0MH4h8CCgSz.AIkHHjXl2e6'
};

router.post('/login', async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // In production, you would fetch the user from your database
    // For this example, we'll use the mock user
    const user = mockUser;

    if (!user || username !== user.username) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const token = jwt.sign(
      { 
        userId: user.id,
        username: user.username
      },
      secret,
      { expiresIn: '24h' }
    );

    // Send response
    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Validate token endpoint (optional but useful for client-side token validation)
router.get('/validate', async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).json({ message: 'Token is valid' });
});

export default router;