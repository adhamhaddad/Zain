import { Request, Response } from 'express';
import User from '../../models/user';

const user = new User();

export const createAdminUser = async (req: Request, res: Response) => {
  try {
    const response = await user.createAdminUser(req.body);
    res.status(201).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
