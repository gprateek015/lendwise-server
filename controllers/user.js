import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import ExpressError from '../utilities/express-error.js';

export const registerUser = async (req, res) => {
  const { password, mobile_no, first_name, last_name } = req.body;

  const saltRounds = 10;
  const hash_password = await bcrypt.hash(password, saltRounds);

  const newUser = new User({ mobile_no, first_name, last_name, hash_password });

  const json_secret_key = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(newUser._id.toString(), json_secret_key);

  await newUser.save();

  res.status(200).send({
    success: true,
    token,
    user: {
      ...newUser.toJSON(),
      hash_password: undefined
    }
  });
};

export const loginUser = async (req, res) => {
  const { mobile_no, password } = req.body;

  const user = await User.findOne({ mobile_no });

  if (!user) {
    throw new ExpressError("User doesn't exist. Please register!", 400);
  }

  const match = await bcrypt.compare(password, user.hash_password);
  if (match) {
    const json_secret_key = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(user._id.toString(), json_secret_key);

    res.status(200).send({
      success: true,
      user: {
        ...user.toJSON(),
        hash_password: undefined
      },
      token
    });
  } else {
    throw new ExpressError("Mobile Number and password doesn't match", 400);
  }
};

export const fetchSelf = async (req, res) => {
  const { user } = req;

  if (!user) {
    throw new ExpressError('User not found', 401);
  }

  res.status(200).send({
    success: true,
    user: { ...user.toJSON(), hash_password: undefined }
  });
};
