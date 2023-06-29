"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const userController_1 = __importDefault(require("../controller/userController"));
const enums_1 = require("../common/enums");
const verifyJWT_1 = require("../middlewares/verifyJWT");
exports.userRouter = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
exports.userRouter.route(enums_1.UsersPath.CREATE).post(userController_1.default.createUser);
exports.userRouter.route(enums_1.UsersPath.LOGIN).post(userController_1.default.login);
exports.userRouter.route(enums_1.UsersPath.TOKEN_REFRESH).get(userController_1.default.refresh);
exports.userRouter.route(enums_1.UsersPath.DASHBOARD).get(verifyJWT_1.verifyJWT, userController_1.default.dashboard);
exports.userRouter.route(enums_1.UsersPath.UPLOAD_AVATAR).post(upload.single("image"), userController_1.default.uploadAvatar);
exports.userRouter.route(enums_1.UsersPath.UPDATE_ONE).put(userController_1.default.updateOne);
//# sourceMappingURL=userRoutes.js.map