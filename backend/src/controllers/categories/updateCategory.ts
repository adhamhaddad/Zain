import { Response } from 'express';
import { Request } from '../../middleware';
import Category from '../../models/category';

const category = new Category();

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const response = await category.updateCategory(
      parseInt(req.params.id),
      req.body
    );
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
