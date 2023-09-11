import { Response } from 'express';
import { Request } from '../../middleware';
import Level from '../../models/level';

const level = new Level();

export const deleteLevel = async (req: Request, res: Response) => {
  try {
    const response = await level.deleteLevel(parseInt(req.params.id));
    res.setHeader('Content-Location', `/levels/${response.id}`);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
