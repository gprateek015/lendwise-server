import jwt from 'jsonwebtoken';
import User from './models/user.js';
import catchAsync from './utilities/catch-async.js';
import ExpressError from './utilities/express-error.js';

export const authenticateUser = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  const json_secret_key = process.env.JWT_SECRET_KEY;
  const user_id = jwt.verify(authorization, json_secret_key);
  const user = await User.findById(user_id);
  if (user) {
    req.user = user;
    next();
  } else {
    throw new ExpressError('user_not_authenticated', 401);
  }
});

export const authenticateAdmin = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  const json_secret_key = process.env.JWT_SECRET_KEY;
  const user_id = jwt.verify(authorization, json_secret_key);
  const user = await User.findById(user_id);
  if (user && user.user_type === 'admin') {
    req.user = user;
    next();
  } else {
    throw new ExpressError('user_not_authorized', 401);
  }
});
