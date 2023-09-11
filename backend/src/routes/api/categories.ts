import { Router } from 'express';
import {
  validateCreateCategory,
  validateGetCategories,
  validateUpdateCategory,
  validateDeleteCategory
} from '../../middleware/validation/categories';
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} from '../../controllers/categories';
import {
  expressFilterRequest,
  verifyToken,
  verifyAdmin
} from '../../middleware';

const allowKeys = {
  post: ['name', 'group_id'],
  patch: ['name']
};

const router = Router();

router
  .post(
    '/',
    validateCreateCategory,
    verifyToken,
    verifyAdmin,
    expressFilterRequest(allowKeys),
    createCategory
  )
  .get(
    '/:group_id',
    validateGetCategories,
    verifyToken,
    verifyAdmin,
    getCategories
  )
  .patch(
    '/:id',
    validateUpdateCategory,
    verifyToken,
    verifyAdmin,
    expressFilterRequest(allowKeys),
    updateCategory
  )
  .delete(
    '/:id',
    validateDeleteCategory,
    verifyToken,
    verifyAdmin,
    deleteCategory
  );

export default router;
