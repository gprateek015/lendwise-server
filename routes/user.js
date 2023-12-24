import { Router } from 'express';
import { fetchSelf, loginUser, registerUser } from '../controllers/user.js';
import catchAsync from '../utilities/catch-async.js';
import { authenticateUser } from '../middlewase.js';

const router = Router();

router
  .route('/')
  .post(catchAsync(registerUser))
  .get(authenticateUser, catchAsync(fetchSelf));

router.post('/login', catchAsync(loginUser));

export default router;
