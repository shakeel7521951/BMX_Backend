 import Errorhandler from './ErrorHandler.js';
import UserModel from '../Model/UserModel.js';
import jwt from 'jsonwebtoken';

export const isUserLoggedin = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new Errorhandler('Please login to access this page.'));
  }
  console.log("JWT_SECRET at auth ",process.env.JWT_SECRET);
  const Decode = jwt.verify(token, process.env.JWT_SECRET);

  const user = await UserModel.findById(Decode.id);

  req.user = user;

  next();
};
