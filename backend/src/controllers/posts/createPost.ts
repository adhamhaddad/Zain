import { Response } from 'express';
import { Request } from '../../middleware';
import Post from '../../models/post';

const post = new Post();

export const createPost = async (req: Request, res: Response) => {
  try {
    const user_id: number = req.user?.id as unknown as number;
    const response = await post.createPost({ ...req.body, user_id });
    res.status(201).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
