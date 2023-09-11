import { Router } from 'express';
import {
  validateCreateUser,
  validateGetUser,
  validateUpdateUser,
  validateDeleteUser
} from '../../middleware/validation/users';
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
} from '../../controllers/users';
import {
  verifyToken,
  verifyAdmin,
  expressFilterRequest
} from '../../middleware';

const allowedKeys = {
  post: [
    'first_name',
    'middle_name',
    'last_name',
    'phone',
    'group_id',
    'level_id'
  ],
  patch: ['first_name', 'middle_name', 'last_name', 'phone']
};

const router = Router();

router
  .post(
    '/',
    validateCreateUser,
    verifyToken,
    verifyAdmin,
    expressFilterRequest(allowedKeys),
    createUser
  )
  .get('/', verifyToken, verifyAdmin, getUsers)
  .get('/:id', validateGetUser, verifyToken, getUser)
  .patch(
    '/:id',
    validateUpdateUser,
    verifyToken,
    verifyAdmin,
    expressFilterRequest(allowedKeys),
    updateUser
  )
  .delete('/:id', validateDeleteUser, verifyToken, verifyAdmin, deleteUser);

export default router;
