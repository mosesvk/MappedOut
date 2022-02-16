import { v4 as uuid } from 'uuid';
import { validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { HttpError } from '../models/errorHandler.js';

import User from '../models/userModel.js';

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Test',
    email: 'test@test.com',
    password: 'testers',
  },
];

// ------------------------
//@desc     Fetch all users
//@route    GET /api/users
//@access   Private
const getAllUsers = asyncHandler(async (req, res, next) => {
  res.json({ users: DUMMY_USERS });
});

// ------------------------
//@desc     register user
//@route    POST /api/users
//@access   Private
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

//@desc     login user
//@route    GET /api/users
//@access   Private
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser) {
    throw new HttpError(
      'Could not identify user, credentials seem to be wrong',
      401
    );
  }
  res.json({ message: 'Logged In' });
});

export { getAllUsers, signup, login };
