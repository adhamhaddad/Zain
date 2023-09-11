import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validate } from '../validationResult';

export const validateUpdatePost = [
  body('post_caption')
    .exists()
    .withMessage('Post caption is missing from the body.')
    .notEmpty()
    .withMessage('Post caption is empty')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Post caption must be at least 2 and maximum 50 letters'),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
