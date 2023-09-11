import { Request, Response, NextFunction } from 'express';
import { check, body } from 'express-validator';
import { validate } from '../validationResult';

export const validateUpdateCategory = [
  check('id')
    .exists()
    .withMessage('id is missing from the parameters')
    .notEmpty()
    .withMessage('id is empty'),
  body('name')
    .exists()
    .withMessage('Category name is missing from the body.')
    .notEmpty()
    .withMessage('Category name is empty')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be at least 2 and maximum 50 letters'),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
