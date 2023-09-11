import { Response } from 'express';
import { Request } from '../../middleware';
import { io } from '../../server';
import PostLike from '../../models/postLike';

const postLike = new PostLike();

export const createPostLike = async (req: Request, res: Response) => {
  try {
    const user_id: number = req.user?.id as unknown as number;
    const response = await postLike.createPostLike({ ...req.body, user_id });
    res.status(201).json({ data: response });
    io.emit('post_likes', { action: 'CREATE', data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
