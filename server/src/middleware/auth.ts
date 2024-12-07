import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Response | void => {  // Explicitly define return types
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // If no token is provided, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the token using the JWT_SECRET from environment variables
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, secret);
    
    // Attach the decoded user to the request object
    req.user = decoded;
    
    // Proceed to the next middleware/route handler
    return next();
  } catch (error) {
    // Handle different types of JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token has expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    // Handle any other errors
    return res.status(500).json({ message: 'Internal server error' });
  }
};