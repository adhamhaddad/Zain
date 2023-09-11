import { Router } from 'express';
import {
  validateCreatePostLike,
  validateDeletePostLike
} from '../../middleware/validation/postLikes';
import { createPostLike, deletePostLike } from '../../controllers/postLikes';
import { verifyToken } from '../../middleware';

const router = Router();

router
  .post('/', validateCreatePostLike, verifyToken, createPostLike)
  .delete('/:id', validateDeletePostLike, verifyToken, deletePostLike);

export default router;
