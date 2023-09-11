import { Response } from 'express';
import { Request } from '../../middleware';
import ProfilePicture from '../../models/profilePictures';

const profilePicture = new ProfilePicture();

export const createProfilePicture = async (req: Request, res: Response) => {
  try {
    const user_id: number = req.user?.id as unknown as number;
    const response = await profilePicture.createProfilePicture({
      ...req.body,
      image_url: req.file?.path,
      user_id
    });
    res.status(201).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
