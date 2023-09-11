import { Response } from 'express';
import { Request } from '../../middleware';
import Level from '../../models/level';

const level = new Level();

export const createLevel = async (req: Request, res: Response) => {
  try {
    const response = await level.createLevel(req.body);
    res.status(201).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
