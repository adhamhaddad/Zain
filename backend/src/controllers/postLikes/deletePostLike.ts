import { Response } from 'express';
import { Request } from '../../middleware';
import { io } from '../../server';
import PostLike from '../../models/postLike';

const postLike = new PostLike();

export const deletePostLike = async (req: Request, res: Response) => {
  try {
    const user_id: number = req.user?.id as unknown as number;
    const response = await postLike.deletePostLike(
      parseInt(req.params.id),
      user_id
    );
    io.emit('post_likes', { action: 'DELETE', data: response });
    res.setHeader('Content-Location', `/post-likes/${response.id}`);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
