import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validate } from '../validationResult';

const validRoles = ['admin', 'moderator'];

export const validateCreateAdminUser = [
  body('first_name')
    .exists()
    .withMessage('First name is missing from the body.')
    .notEmpty()
    .withMessage('First name is empty')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be at least 2 and maximum 50 letters'),
  body('middle_name')
    .exists()
    .withMessage('Middle name is missing from the body.')
    .notEmpty()
    .withMessage('Middle name is empty')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Middle name must be at least 2 and maximum 50 letters'),
  body('last_name')
    .exists()
    .withMessage('Last name is missing from the body.')
    .notEmpty()
    .withMessage('Last name is empty')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be at least 2 and maximum 50 letters'),
  body('phone')
    .exists()
    .withMessage('Phone is missing from the body')
    .notEmpty()
    .withMessage('Phone is empty')
    .matches(/^(01)[0-9]{9}$/)
    .withMessage('Phone number is not valid')
    .custom((value, { req }) => {
      return true;
    }),
  body('role')
    .exists()
    .withMessage('role is missing from the body')
    .notEmpty()
    .withMessage('role is empty')
    .isString()
    .withMessage('role must be a string')
    .isIn(validRoles)
    .withMessage(`Invalid role. Valid roles are: ${validRoles.join(', ')}`),
  body('password')
    .exists()
    .withMessage('Password is missing from the body')
    .notEmpty()
    .withMessage('Password is empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
