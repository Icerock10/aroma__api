import { User } from '../models/User';
import { Request, Response } from 'express';
import { IUser } from '../common/interfaces';
import { jwtService } from '../services/jwt.service';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import { ErrorService } from '../services/error/error.service';
import S3Service from '../services/aws-s3/s3.service';
class userController {
  createUser = asyncHandler(async (req, res, next): Promise<void> => {
    const { name, email, password } = req.body;

    const isDuplicate = await User.findOne({ email });

    if (isDuplicate) return next(ErrorService.unAuthorizedErr('This email has already been taken'));

    const hashedPassword = await bcrypt.hash(password, 10);
    const user: IUser = await User.create({ name, email, 'password': hashedPassword });

    const accessToken = jwtService.generateAccessToken(email);
    const refreshToken = jwtService.generateRefreshToken(email);

    res.json({ user, message: 'Account created', accessToken, refreshToken });
  });
  login = asyncHandler(async (req: Request, res: Response, next): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !password) next(ErrorService.badRequestErr('All fields are required'));

    const foundUser = await User.findOne({ email });

    if (!foundUser) next(ErrorService.unAuthorizedErr('User was not found'));

    const isPassCorrect = await bcrypt.compare(password, foundUser.password);
    if (!isPassCorrect) next(ErrorService.unAuthorizedErr('Your email or password is not correct'));
    // jwt sign verification
    const accessToken = jwtService.generateAccessToken(email);
    const refreshToken = jwtService.generateRefreshToken(email);
    const user = foundUser.avatar ? await S3Service._getAvatar(foundUser) : foundUser;
    res.json({ user, accessToken, refreshToken });
  });

  refresh = asyncHandler(async (req, res, next): Promise<any> => {
    const refreshToken = req.headers.authorization;
    if (!refreshToken) next(ErrorService.unAuthorizedErr('Token not found'));
    const accessToken = await jwtService.verifyRefreshToken(refreshToken, next);
    res.json({ accessToken });
  });
  dashboard = asyncHandler(async (req: any, res, next): Promise<void> => {
    const email = req.email;
    const user = await User.findOne({ email });
    if (!user) next(ErrorService.unAuthorizedErr('User was not found'));

    const userData = user.avatar ? await S3Service._getAvatar(user) : user;
    res.json(userData);
  });
  uploadAvatar = asyncHandler(async (req: any, res, next): Promise<void> => {
    const { id } = req.body;
    if (!req.file || !id) return next(ErrorService.badRequestErr('File or ID were not found'));
    const { originalname, mimetype, buffer } = req.file;
    const user = await User.findById(id);
    if (!user) return next(ErrorService.internalErr('User was not found'));
    await S3Service._upload(originalname, buffer, mimetype);
    user.avatar = originalname;
    await user.save();
    const userAvatar = await S3Service._getAvatar(user);
    res.json(userAvatar.avatarUrl);
  });
  updateOne = asyncHandler(async (req, res, next): Promise<void> => {
    const { name, email, location, jobPosition, id: userId } = req.body;

    const newUser = { name, email, location, jobPosition };

    const updatedUser = await User.findOneAndUpdate({ _id: userId }, newUser, { new: true });
    if (!updatedUser) return next(ErrorService.internalErr('Something went wrong...'));
    res.json(updatedUser);
  });
}

export default new userController();
