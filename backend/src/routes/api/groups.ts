import { Router } from 'express';
import {
  validateCreateGroup,
  validateGetGroups,
  validateUpdateGroup,
  validateDeleteGroup
} from '../../middleware/validation/groups';
import {
  createGroup,
  getGroups,
  updateGroup,
  deleteGroup
} from '../../controllers/groups';
import {
  expressFilterRequest,
  verifyToken,
  verifyAdmin
} from '../../middleware';

const allowKeys = {
  post: ['name', 'level_id'],
  patch: ['name', 'level_id']
};

const router = Router();

router
  .post(
    '/',
    validateCreateGroup,
    verifyToken,
    verifyAdmin,
    expressFilterRequest(allowKeys),
    createGroup
  )
  .get('/:level_id', validateGetGroups, verifyToken, verifyAdmin, getGroups)
  .patch(
    '/:id',
    validateUpdateGroup,
    verifyToken,
    verifyAdmin,
    expressFilterRequest(allowKeys),
    updateGroup
  )
  .delete('/:id', validateDeleteGroup, verifyToken, verifyAdmin, deleteGroup);

export default router;
