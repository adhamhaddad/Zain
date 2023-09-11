import { Router } from 'express';
import {
  validateRegister,
  validateLogin,
  validateUpdatePassword
} from '../../middleware/validation/auth';
import {
  createAdminUser,
  authUser,
  authMe,
  updatePassword
} from '../../controllers/auth';
import { verifyToken, expressFilterRequest } from '../../middleware';

const router = Router();

const allowedKeys = {
  post: ['first_name', 'middle_name', 'last_name', 'phone', 'role', 'password'],
  login: ['phone', 'password'],
  patch: ['current_password', 'new_password']
};

router
  .post(
    '/register',
    validateRegister,
    expressFilterRequest(allowedKeys),
    createAdminUser
  )
  .post('/login', validateLogin, expressFilterRequest(allowedKeys), authUser)
  .patch(
    '/reset-password',
    validateUpdatePassword,
    verifyToken,
    expressFilterRequest(allowedKeys),
    updatePassword
  )
  .get('/auth-me', authMe);

export default router;
