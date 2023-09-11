import { Response } from 'express';
import { Request } from '../../middleware';
import UserGroup from '../../models/userGroup';

const userGroup = new UserGroup();

export const updateUserGroup = async (req: Request, res: Response) => {
  try {
    const response = await userGroup.updateUserGroup(
      parseInt(req.params.id),
      req.body
    );
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
