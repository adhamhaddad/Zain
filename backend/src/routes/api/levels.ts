import { Router } from 'express';
import {
  validateCreateLevel,
  validateUpdateLevel,
  validateDeleteLevel
} from '../../middleware/validation/levels';
import {
  createLevel,
  getLevels,
  updateLevel,
  deleteLevel
} from '../../controllers/levels';
import {
  expressFilterRequest,
  verifyToken,
  verifyAdmin
} from '../../middleware';

const allowKeys = {
  post: ['level'],
  patch: ['level']
};

const router = Router();

router
  .post(
    '/',
    validateCreateLevel,
    verifyToken,
    verifyAdmin,
    expressFilterRequest(allowKeys),
    createLevel
  )
  .get('/', verifyToken, verifyAdmin, getLevels)
  .patch(
    '/:id',
    validateUpdateLevel,
    verifyToken,
    verifyAdmin,
    expressFilterRequest(allowKeys),
    updateLevel
  )
  .delete('/:id', validateDeleteLevel, verifyToken, verifyAdmin, deleteLevel);

export default router;
