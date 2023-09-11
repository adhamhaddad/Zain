import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validate } from '../validationResult';

export const validateCreateUser = [
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
  body('group_id')
    .exists()
    .withMessage('group_id is missing from the body')
    .notEmpty()
    .withMessage('group_id is empty')
    .isNumeric()
    .withMessage('group_id must be a number'),
  body('level_id')
    .exists()
    .withMessage('level_id is missing from the body')
    .notEmpty()
    .withMessage('level_id is empty')
    .isNumeric()
    .withMessage('level_id must be a number'),
  (req: Request, res: Response, next: NextFunction) => validate(req, res, next)
];
