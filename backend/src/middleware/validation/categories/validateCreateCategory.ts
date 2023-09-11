import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validate } from '../validationResult';

export const validateCreateCategory = [
  body('name')
    .exists()
    .withMessage('Category name is missing from the body.')
    .notEmpty()
    .withMessage('Category name is empty')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be at least 2 and maximum 50 letters'),
  body('group_id')
    .exists()
    .withMessage('group_id is missing from the body')
    .notEmpty()
    .withMessage('group_id is empty')
    .isNumeric()
    .withMessage('group_id must be a number'),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
