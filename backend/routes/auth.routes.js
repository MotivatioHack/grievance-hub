import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
import { body } from 'express-validator';

const router = express.Router();

// Add the express.json() middleware here for this specific route
router.use(express.json());

router.post(
  '/register',
  [
    body('name').not().isEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  registerUser
);
router.post('/login', loginUser);

export default router;