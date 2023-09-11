import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validate } from '../validationResult';

export const validateLogin = [
  body('phone')
    .exists()
    .withMessage('Phone is missing from the body')
    .notEmpty()
    .withMessage('Phone is empty')
    .matches(/^(01)[0-9]{9}$/)
    .withMessage('Egyptian phone number is not valid')
    .custom((value, { req }) => {
      return true;
    }),
  body('password')
    .exists()
    .withMessage('Password is missing from the body')
    .notEmpty()
    .withMessage('Password is empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
