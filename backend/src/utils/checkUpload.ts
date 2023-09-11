import { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';

const uploadFolders = [
  'uploads',
  'uploads/profile-pictures',
  'uploads/post-images',
  'uploads/post-videos',
  'uploads/test-images',
  'uploads/submition-images'
];

export const checkFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    for (const folder of uploadFolders) {
      const folderPath = path.join(__dirname, '..', '..', folder);
      try {
        await fs.access(folderPath);
      } catch {
        await fs.mkdir(folderPath);
      }
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};
