"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const jwt_service_1 = require("../services/jwt.service");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const error_service_1 = require("../services/error/error.service");
const s3_service_1 = __importDefault(require("../services/aws-s3/s3.service"));
class userController {
    constructor() {
        this.createUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = req.body;
            const isDuplicate = yield User_1.User.findOne({ email });
            if (isDuplicate)
                return next(error_service_1.ErrorService.unAuthorizedErr('This email has already been taken'));
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = yield User_1.User.create({ name, email, 'password': hashedPassword });
            const accessToken = jwt_service_1.jwtService.generateAccessToken(email);
            const refreshToken = jwt_service_1.jwtService.generateRefreshToken(email);
            res.json({ user, message: 'Account created', accessToken, refreshToken });
        }));
        this.login = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password)
                next(error_service_1.ErrorService.badRequestErr('All fields are required'));
            const foundUser = yield User_1.User.findOne({ email });
            if (!foundUser)
                next(error_service_1.ErrorService.unAuthorizedErr('User was not found'));
            const isPassCorrect = yield bcrypt_1.default.compare(password, foundUser.password);
            if (!isPassCorrect)
                next(error_service_1.ErrorService.unAuthorizedErr('Your email or password is not correct'));
            // jwt sign verification
            const accessToken = jwt_service_1.jwtService.generateAccessToken(email);
            const refreshToken = jwt_service_1.jwtService.generateRefreshToken(email);
            const user = foundUser.avatar ? yield s3_service_1.default._getAvatar(foundUser) : foundUser;
            res.json({ user, accessToken, refreshToken });
        }));
        this.refresh = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.headers.authorization;
            if (!refreshToken)
                next(error_service_1.ErrorService.unAuthorizedErr('Token not found'));
            const accessToken = yield jwt_service_1.jwtService.verifyRefreshToken(refreshToken, next);
            res.json({ accessToken });
        }));
        this.dashboard = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const email = req.email;
            const user = yield User_1.User.findOne({ email });
            if (!user)
                next(error_service_1.ErrorService.unAuthorizedErr('User was not found'));
            const userData = user.avatar ? yield s3_service_1.default._getAvatar(user) : user;
            res.json(userData);
        }));
        this.uploadAvatar = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            if (!req.file || !id)
                return next(error_service_1.ErrorService.badRequestErr('File or ID were not found'));
            const { originalname, mimetype, buffer } = req.file;
            const user = yield User_1.User.findById(id);
            if (!user)
                return next(error_service_1.ErrorService.internalErr('User was not found'));
            yield s3_service_1.default._upload(originalname, buffer, mimetype);
            user.avatar = originalname;
            yield user.save();
            const userAvatar = yield s3_service_1.default._getAvatar(user);
            res.json(userAvatar.avatarUrl);
        }));
        this.updateOne = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { name, email, location, jobPosition, id: userId } = req.body;
            const newUser = { name, email, location, jobPosition };
            const updatedUser = yield User_1.User.findOneAndUpdate({ _id: userId }, newUser, { new: true });
            if (!updatedUser)
                return next(error_service_1.ErrorService.internalErr('Something went wrong...'));
            res.json(updatedUser);
        }));
    }
}
exports.default = new userController();
//# sourceMappingURL=userController.js.map