import { Response } from 'express';
import { Request } from '../../middleware';
import Post from '../../models/post';

const post = new Post();

export const deletePost = async (req: Request, res: Response) => {
  try {
    const user_id: number = req.user?.id as unknown as number;
    const response = await post.deletePost(parseInt(req.params.id), user_id);
    res.setHeader('Content-Location', `/posts/${response.id}`);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
