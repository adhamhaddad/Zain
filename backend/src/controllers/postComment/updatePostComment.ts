import { Response } from 'express';
import { Request } from '../../middleware';
import { io } from '../../server';
import PostComment from '../../models/postComment';

const postComment = new PostComment();

export const updatePostComment = async (req: Request, res: Response) => {
  try {
    const user_id: number = req.user?.id as unknown as number;
    const response = await postComment.updatePostComment(
      parseInt(req.params.id),
      { ...req.body, user_id }
    );
    io.emit('post_comments', { action: 'UPDATE', data: response });
    res.status(201).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
