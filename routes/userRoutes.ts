import express from "express";
import multer from "multer";
import userController from "../controller/userController";
import { UsersPath } from "../common/enums";
import { verifyJWT } from "../middlewares/verifyJWT";
export const userRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

userRouter.route(UsersPath.CREATE).post(userController.createUser);
userRouter.route(UsersPath.LOGIN).post(userController.login);
userRouter.route(UsersPath.TOKEN_REFRESH).get(userController.refresh);
userRouter.route(UsersPath.DASHBOARD).get(verifyJWT, userController.dashboard);
userRouter.route(UsersPath.UPLOAD_AVATAR).post(upload.single("image"), userController.uploadAvatar);
userRouter.route(UsersPath.UPDATE_ONE).put(userController.updateOne);
