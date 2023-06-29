"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
const jwt_service_1 = require("../services/jwt.service");
const error_service_1 = require("../services/error/error.service");
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
        next(error_service_1.ErrorService.unAuthorizedErr('Access token was not found or invalid'));
    }
    const accessToken = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    jwt_service_1.jwtService.verifyAccessToken(accessToken, next, req);
};
exports.verifyJWT = verifyJWT;
//# sourceMappingURL=verifyJWT.js.map