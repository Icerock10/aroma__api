import { User } from '../models/User';
import { NextFunction, Request, Response } from 'express';
import { CustomRequest, IUser } from '../common/interfaces/interfaces';
import { ResponseMessage } from '../common/enums/response-messages-enums';
import { PASSWORD_FIELD, SALT_ROUNDS } from '../common/constants/constants';
import { jwtService } from '../services/jwt.service';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import { ErrorService } from '../services/error/error.service';
import S3Service from '../services/aws-s3/s3.service';
class userController {
  createUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { name, email, password }: IUser = req.body;

      const isDuplicate: IUser = await User.findOne({ email });

      if (isDuplicate) return next(ErrorService.unAuthorizedErr(ResponseMessage.EMAIL_TAKEN));

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const user: IUser = await User.create({ name, email, [`${PASSWORD_FIELD}`]: hashedPassword });

      const accessToken = jwtService.generateAccessToken(email);
      const refreshToken = jwtService.generateRefreshToken(email);

      res.json({ user, message: ResponseMessage.ACCOUNT_CREATED, accessToken, refreshToken });
    },
  );
  login = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email, password }: IUser = req.body;

    if (!email || !password) next(ErrorService.badRequestErr(ResponseMessage.FIELDS_REQUIRED));

    const foundUser = await User.findOne({ email });

    if (!foundUser) next(ErrorService.unAuthorizedErr(ResponseMessage.USER_NOT_FOUND));

    const isPassCorrect = await bcrypt.compare(password, foundUser.password);
    if (!isPassCorrect)
      next(ErrorService.unAuthorizedErr(ResponseMessage.EMAIL_OR_PASSWORD_INCORRECT));
    // jwt sign verification
    const accessToken = jwtService.generateAccessToken(email);
    const refreshToken = jwtService.generateRefreshToken(email);

    const user: IUser = foundUser.avatar ? await S3Service._getAvatar(foundUser) : foundUser;

    res.json({ user, accessToken, refreshToken });
  });

  refresh = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const refreshToken: string = req.headers.authorization;
    if (!refreshToken) next(ErrorService.unAuthorizedErr(ResponseMessage.TOKEN_NOT_FOUND));
    const accessToken: string = await jwtService.verifyRefreshToken(refreshToken, next);
    res.json({ accessToken });
  });
  dashboard = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
      const email = req.email;
      const user: IUser = await User.findOne({ email });
      if (!user) next(ErrorService.unAuthorizedErr(ResponseMessage.USER_NOT_FOUND));

      const userData: IUser = user.avatar ? await S3Service._getAvatar(user) : user;

      res.json(userData);
    },
  );
  uploadAvatar = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
      const { id } = req.body;
      if (!req.file || !id)
        return next(ErrorService.badRequestErr(ResponseMessage.FILE_OR_ID_NOT_FOUND));
      const { originalname, mimetype, buffer } = req.file;
      const user: IUser = await User.findById(id);
      if (!user) return next(ErrorService.internalErr(ResponseMessage.USER_NOT_FOUND));

      await S3Service._upload(originalname, buffer, mimetype);

      user.avatar = originalname;
      await user.save();
      const userAvatar = await S3Service._getAvatar(user);
      res.json(userAvatar.avatarUrl);
    },
  );
  updateOne = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { name, email, location, jobPosition, id: userId } = req.body;

      const newUser = { name, email, location, jobPosition };

      const updatedUser: IUser = await User.findOneAndUpdate({ _id: userId }, newUser, {
        new: true,
      });
      if (!updatedUser) return next(ErrorService.internalErr(ResponseMessage.SOMETHING_WENT_WRONG));
      res.json(updatedUser);
    },
  );
}

export default new userController();
