import { Request, Response, NextFunction } from 'express';
import { check, body } from 'express-validator';
import { validate } from '../validationResult';

export const validateUpdatePostComment = [
  check('id')
    .exists()
    .withMessage('id is missing from the parameters')
    .notEmpty()
    .withMessage('id is empty'),
  body('comment')
    .exists()
    .withMessage('Post comment is missing from the body.')
    .notEmpty()
    .withMessage('Post comment is empty')
    .isString()
    .isLength({ min: 2, max: 2000 })
    .withMessage('Post comment must be at least 2 and maximum 50 letters'),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
