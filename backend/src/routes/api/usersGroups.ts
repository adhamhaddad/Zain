import { Router } from 'express';
import {
  validateGetUserGroups,
  validateUpdateUserGroup
} from '../../middleware/validation/usersGroups';
import { getUserGroups, updateUserGroup } from '../../controllers/usersGroups';
import {
  expressFilterRequest,
  verifyToken,
  verifyAdmin
} from '../../middleware';

const allowKeys = {
  patch: ['user_id', 'group_id']
};

const router = Router();

router
  .get('/:user_id', validateGetUserGroups, verifyToken, getUserGroups)
  .patch(
    '/:id',
    validateUpdateUserGroup,
    verifyToken,
    verifyAdmin,
    expressFilterRequest(allowKeys),
    updateUserGroup
  );

export default router;
