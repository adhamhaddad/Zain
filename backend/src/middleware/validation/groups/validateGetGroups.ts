import { Request, Response, NextFunction } from 'express';
import { check } from 'express-validator';
import { validate } from '../validationResult';

export const validateGetGroups = [
  check('level_id')
    .exists()
    .withMessage('level_id is missing from the parameters')
    .notEmpty()
    .withMessage('level_id is empty'),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
