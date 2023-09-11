import { Response } from 'express';
import { Request } from '../../middleware';
import Post from '../../models/post';

const post = new Post();

export const getPosts = async (req: Request, res: Response) => {
  try {
    const response = await post.getPosts(parseInt(req.params.id));
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
