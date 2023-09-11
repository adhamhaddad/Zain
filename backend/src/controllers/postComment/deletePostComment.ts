import { Response } from 'express';
import { Request } from '../../middleware';
import { io } from '../../server';
import PostComment from '../../models/postComment';

const postComment = new PostComment();

export const deletePostComment = async (req: Request, res: Response) => {
  try {
    const user_id: number = req.user?.id as unknown as number;
    const response = await postComment.deletePostComment(
      parseInt(req.params.id),
      user_id
    );
    io.emit('post_comments', { action: 'DELETE', data: response });
    res.setHeader('Content-Location', `/post-comments/${response.id}`);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
