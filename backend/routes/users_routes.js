import express from 'express';
import { check } from 'express-validator';
import { getAllUsers, login, signup } from '../controllers/users_controller.js';
import fileUpload from '../middleware/file-upload'
const router = express.Router();

router.get('/', getAllUsers);
router.post(
  '/signup',
  fileUpload.single('image'),
  [
    check('name').trim().notEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  signup
);
router.post('/login', login);

export default router;
