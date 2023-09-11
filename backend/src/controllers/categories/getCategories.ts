import { Response } from 'express';
import { Request } from '../../middleware';
import Category from '../../models/category';

const category = new Category();

export const getCategories = async (req: Request, res: Response) => {
  try {
    const response = await category.getCategories(
      parseInt(req.params.group_id)
    );
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
