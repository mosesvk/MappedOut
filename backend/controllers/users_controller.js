import { v4 as uuid } from 'uuid';
import {validationResult} from 'express-validator';
import asyncHandler from 'express-async-handler';
import { HttpError } from '../models/errorHandler.js';

const DUMMY_USERS = [
  {
    id: 'u1', 
    name: 'Test',
    email: 'test@test.com',
    password: 'testers'
  }
]

//@desc     Fetch all users
//@route    GET /api/users
//@access   Private
const getAllUsers = asyncHandler(async(req, res, next) => {
  res.json({users: DUMMY_USERS})
})

//@desc     register user
//@route    POST /api/users
//@access   Private
const signup = asyncHandler(async(req, res, next) => {
  // this validationResult is connected to the check() function. This is all through express-validator to validate information
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError('Invalid inputs passed, please check your data', 422);
  }
  
  const {name, email, password} = req.body;

  // this code is to check if there is already a user with the same email
  const hasUser = DUMMY_USERS.find(u => u.email === email)
  if (hasUser) {
    throw new HttpError('Could not create user, email already exists', 422)
  }

  const createdUser = {
    id: uuid(),
    name,
    email, 
    password
  }

  DUMMY_USERS.push(createdUser)

  res.status(201).json({user: createdUser})
})

//@desc     login user
//@route    GET /api/users
//@access   Private
const login = asyncHandler(async(req, res, next) => {
  const {email, password} = req.body

  const identifiedUser = DUMMY_USERS.find(u => u.email === email)
  if (!identifiedUser) {
    throw new HttpError('Could not identify user, credentials seem to be wrong', 401)
  }
  res.json({message: 'Logged In'})
})

export {
  getAllUsers,
  signup,
  login
}