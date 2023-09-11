import { Request, Response, NextFunction } from 'express';
import { check, body } from 'express-validator';
import { validate } from '../validationResult';

export const validateUpdateUserGroup = [
  check('id')
    .exists()
    .withMessage('id is missing from the parameters')
    .notEmpty()
    .withMessage('id is empty'),
  body('group_id')
    .exists()
    .withMessage('group_id is missing from the body')
    .notEmpty()
    .withMessage('group_id is empty')
    .isNumeric()
    .withMessage('group_id must be a number'),
  body('user_id')
    .exists()
    .withMessage('user_id is missing from the body')
    .notEmpty()
    .withMessage('user_id is empty')
    .isNumeric()
    .withMessage('user_id must be a number'),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
