import { Request, Response, NextFunction } from 'express';
import { body, oneOf } from 'express-validator';
import { validate } from '../validationResult';

export const validateCreatePostComment = [
  body('comment')
    .exists()
    .withMessage('Post comment is missing from the body.')
    .notEmpty()
    .withMessage('Post comment is empty')
    .isString()
    .isLength({ min: 2, max: 2000 })
    .withMessage('Post comment must be at least 2 and maximum 50 letters'),
  oneOf(
    [
      body('post_id')
        .exists()
        .withMessage('post_id is missing from the body')
        .notEmpty()
        .withMessage('post_id is empty')
        .isNumeric()
        .withMessage('post_id must be a number'),
      body('group_id')
        .exists()
        .withMessage('group_id is missing from the body')
        .notEmpty()
        .withMessage('group_id is empty')
        .isNumeric()
        .withMessage('group_id must be a number')
    ],
    'At least one of post_id or group_id'
  ),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
