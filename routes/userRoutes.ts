import express from "express";
import { multerUploadToStorage } from './helpers/create-multer-storage';
import userController from "../controller/userController";
import { SINGLE_IMAGE } from '../common/constants/constants';
import { UserRoutes } from '../common/enums/user-routes-enums';
import { verifyJWT } from "../middlewares/verifyJWT";
export const userRouter = express.Router();


userRouter.route(UserRoutes.CREATE).post(userController.createUser);
userRouter.route(UserRoutes.LOGIN).post(userController.login);
userRouter.route(UserRoutes.TOKEN_REFRESH).get(userController.refresh);
userRouter.route(UserRoutes.DASHBOARD).get(verifyJWT, userController.dashboard);
userRouter.route(UserRoutes.UPLOAD_AVATAR).post(multerUploadToStorage.single(SINGLE_IMAGE), userController.uploadAvatar);
userRouter.route(UserRoutes.UPDATE_ONE).put(userController.updateOne);
