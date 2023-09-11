import { Response } from 'express';
import { Request } from '../../middleware';
import UserLevel from '../../models/userLevel';

const userLevel = new UserLevel();

export const updateUserLevel = async (req: Request, res: Response) => {
  try {
    const response = await userLevel.updateUserLevel(
      parseInt(req.params.id),
      req.body
    );
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
