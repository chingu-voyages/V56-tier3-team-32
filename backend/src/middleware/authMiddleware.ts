import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';

interface requestWithAuth extends Request {
  userRole?: string;
}

export const authenticate = async (
  req: requestWithAuth,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Missing JWT token' });
    }

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized: Invalid JWT token' });
    }

    let userRole = (payload as any)?.metadata?.role as string;
    if (!userRole) {
      return res.status(403).json({ error: 'Forbidden access: Missing role identifier' });
    }
    req.userRole = userRole;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: requestWithAuth, res: Response, next: NextFunction) => {
    if (!allowedRoles.includes(req.userRole!)) {
      return res.status(403).json({ 
        error: `Forbidden access. Required roles: ${allowedRoles.join(', ')}` 
      });
    }
    next();
  };
};

export const requireAdmin = requireRole(['admin']);
export const requireAdminOrSurgeryTeam = requireRole(['admin', 'surgery-team']); 