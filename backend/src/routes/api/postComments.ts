import { Router } from 'express';
import {
  validateCreatePostComment,
  validateUpdatePostComment,
  validateDeletePostComment
} from '../../middleware/validation/postComments.ts';
import {
  createPostComment,
  updatePostComment,
  deletePostComment
} from '../../controllers/postComment';
import { verifyToken } from '../../middleware';

const router = Router();

router
  .post('/', validateCreatePostComment, verifyToken, createPostComment)
  .patch('/:id', validateUpdatePostComment, verifyToken, updatePostComment)
  .delete('/:id', validateDeletePostComment, verifyToken, deletePostComment);

export default router;
