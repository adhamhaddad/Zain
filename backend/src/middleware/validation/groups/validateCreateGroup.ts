import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validate } from '../validationResult';

export const validateCreateGroup = [
  body('name')
    .exists()
    .withMessage('Group name is missing from the body.')
    .notEmpty()
    .withMessage('Group name is empty')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Group name must be at least 2 and maximum 50 letters'),
  body('level_id')
    .exists()
    .withMessage('level_id is missing from the body')
    .notEmpty()
    .withMessage('level_id is empty')
    .isNumeric()
    .withMessage('level_id must be a number'),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
