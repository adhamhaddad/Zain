import { Request as ExpressRequest, Response } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { redisClient } from '../../database';
import { setAccessToken, verifyRefreshToken, DecodedToken } from '.';

const publicAccessKey = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'keys',
  'accessToken',
  'public.key'
);
interface Request extends ExpressRequest {
  user?: DecodedToken;
}

export const authMe = async (req: Request, res: Response) => {
  try {
    const authorization = req.headers.authorization as string;
    if (!authorization) {
      return res.status(401).json({
        message: 'Not Authorized'
      });
    }
    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new Error(
        'Invalid Authorization header format. Format is "Bearer <token>".'
      );
    }
    try {
      const publicKey = await fs.promises.readFile(publicAccessKey, 'utf8');
      const decoded = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
        issuer: 'Zain'
      }) as DecodedToken;
      const cachedToken = await redisClient.get(
        `access_token:${String(decoded.id)}`
      );
      if (!cachedToken || cachedToken !== token) {
        throw new Error('Access token not found or expired');
      }
      const { id, first_name, middle_name, last_name, phone, role } = decoded;

      req.user = { id, phone, role };

      return res.status(200).json({
        data: {
          user: { id, first_name, middle_name, last_name, phone, role },
          accessToken: token
        }
      });
    } catch (err) {
      if ((err as Error).name !== 'TokenExpiredError') {
        throw new Error('Invalid access token');
      }
      // Get Refresh-Token
      const refreshToken = req.get('X-Refresh-Token') as string;

      // const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new Error('Refresh token missing');
      }
      const [bearer, token] = refreshToken.split(' ');
      if (bearer !== 'Bearer' || !token) {
        throw new Error(
          'Invalid Authorization header format. Format is "Bearer <token>".'
        );
      }

      // Verify the refresh token and obtain a new access token
      const decoded = await verifyRefreshToken(token);
      const { id, first_name, middle_name, last_name, phone, role } = decoded;
      const newAccessToken = await setAccessToken({
        id,
        first_name,
        middle_name,
        last_name,
        phone,
        role
      });

      // Attach user object to request and proceed with new access token
      req.user = { id, phone, role };

      return res.status(200).json({
        data: {
          user: { id, first_name, middle_name, last_name, phone, role },
          accessToken: newAccessToken
        }
      });
    }
  } catch (err) {
    res.status(401).json({ message: (err as Error).message });
  }
};
