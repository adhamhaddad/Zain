import { Response, NextFunction } from 'express';
import { Request } from './expressRequest';

export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isAdmin = req.user?.role;
  if (isAdmin === 'admin') {
    next();
  } else {
    res.status(401).json({
      message: 'You are not have access to this route.'
    });
  }
};
