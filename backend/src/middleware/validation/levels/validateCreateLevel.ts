import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validate } from '../validationResult';

export const validateCreateLevel = [
  body('level')
    .exists()
    .withMessage('Level name is missing from the body.')
    .notEmpty()
    .withMessage('Level name is empty')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Level name must be at least 2 and maximum 50 letters'),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
