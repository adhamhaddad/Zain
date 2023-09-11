import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validate } from '../validationResult';

export const validateCreatePostLike = [
  body('post_id')
    .exists()
    .withMessage('post_id is missing from the body')
    .notEmpty()
    .withMessage('post_id is empty')
    .isNumeric()
    .withMessage('post_id must be a number'),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
