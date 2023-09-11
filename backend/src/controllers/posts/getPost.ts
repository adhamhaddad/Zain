import { Response } from 'express';
import { Request } from '../../middleware';
import Post from '../../models/post';

const post = new Post();

export const getPost = async (req: Request, res: Response) => {
  try {
    const response = await post.getPost(parseInt(req.params.id));
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
