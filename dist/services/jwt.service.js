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
exports.jwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const error_service_1 = require("./error/error.service");
class Jwt {
    constructor() {
        this._jwt_instance = jsonwebtoken_1.default;
    }
    generateAccessToken(email) {
        const expiresInOneWeek = 60 * 60 * 24 * 7;
        return this._jwt_instance.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: expiresInOneWeek,
        });
    }
    generateRefreshToken(email) {
        const expiresInOneWeek = 60 * 60 * 24 * 7;
        return this._jwt_instance.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: expiresInOneWeek,
        });
    }
    verifyRefreshToken(refreshToken, next) {
        return this._jwt_instance.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                next(error_service_1.ErrorService.unAuthorizedErr('Token is not valid or expired'));
            const foundUser = yield User_1.User.findOne({ email: decoded.email });
            if (!foundUser)
                next(error_service_1.ErrorService.unAuthorizedErr('User was not found'));
            return this.generateAccessToken(foundUser.email);
        }));
    }
    verifyAccessToken(accessToken, next, req) {
        return this._jwt_instance.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err)
                next(error_service_1.ErrorService.forbiddenError('You were logged out'));
            req.email = decoded.email;
            next();
        });
    }
}
const jwtService = new Jwt();
exports.jwtService = jwtService;
//# sourceMappingURL=jwt.service.js.map