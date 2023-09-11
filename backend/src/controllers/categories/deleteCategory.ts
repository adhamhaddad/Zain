import { Response } from 'express';
import { Request } from '../../middleware';
import Category from '../../models/category';

const category = new Category();

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const response = await category.deleteCategory(parseInt(req.params.id));
    res.setHeader('Content-Location', `/categories/${response.id}`);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
