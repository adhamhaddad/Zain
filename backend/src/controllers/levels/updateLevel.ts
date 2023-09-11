import { Response } from 'express';
import { Request } from '../../middleware';
import Level from '../../models/level';

const level = new Level();

export const updateLevel = async (req: Request, res: Response) => {
  try {
    const response = await level.updateLevel(parseInt(req.params.id), req.body);
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
