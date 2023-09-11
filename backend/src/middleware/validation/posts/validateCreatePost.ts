import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validate } from '../validationResult';

export const validateCreatePost = [
  body('post_caption')
    .exists()
    .withMessage('Post caption is missing from the body.')
    .notEmpty()
    .withMessage('Post caption is empty')
    .isString()
    .isLength({ min: 2, max: 2000 })
    .withMessage('Post caption must be at least 2 and maximum 50 letters'),
  body('group_id')
    .exists()
    .withMessage('group_id is missing from the body')
    .notEmpty()
    .withMessage('group_id is empty')
    .isNumeric()
    .withMessage('group_id must be a number'),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
