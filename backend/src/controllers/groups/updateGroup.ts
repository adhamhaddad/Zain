import { Response } from 'express';
import { Request } from '../../middleware';
import Group from '../../models/group';

const group = new Group();

export const updateGroup = async (req: Request, res: Response) => {
  try {
    const response = await group.updateGroup(parseInt(req.params.id), req.body);
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
