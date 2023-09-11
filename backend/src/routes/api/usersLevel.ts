import { Router } from 'express';
import { validateUpdateUserLevel } from '../../middleware/validation/usersLevel';
import { updateUserLevel } from '../../controllers/usersLevel';
import {
  expressFilterRequest,
  verifyToken,
  verifyAdmin
} from '../../middleware';

const allowKeys = {
  patch: ['user_id', 'level_id']
};

const router = Router();

router.patch(
  '/:id',
  validateUpdateUserLevel,
  verifyToken,
  verifyAdmin,
  expressFilterRequest(allowKeys),
  updateUserLevel
);

export default router;
