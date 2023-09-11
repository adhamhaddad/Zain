import { Router } from 'express';
import {
  validateCreatePost,
  validateGetPosts,
  validateGetPost,
  validateUpdatePost,
  validateDeletePost
} from '../../middleware/validation/posts';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost
} from '../../controllers/posts';
import { expressFilterRequest, verifyToken } from '../../middleware';

const allowKeys = {
  post: ['post_caption', 'group_id'],
  patch: ['post_caption']
};

const router = Router();

router
  .post(
    '/',
    validateCreatePost,
    verifyToken,
    expressFilterRequest(allowKeys),
    createPost
  )
  .get('/:id', validateGetPosts, verifyToken, getPosts)
  .get('/:id', validateGetPost, verifyToken, getPost)
  .patch(
    '/:id',
    validateUpdatePost,
    verifyToken,
    expressFilterRequest,
    updatePost
  )
  .delete('/:id', validateDeletePost, verifyToken, deletePost);

export default router;
