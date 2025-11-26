"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERIFY_TOKEN = exports.refreshTokenHandler = exports.ACCESS_TOKEN = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("./error");
// import { TokenResponse, UserCreationAttributes } from '../../../interface/auth/LoginAttributes';
const secretKey = 'yourSecretKey';
const INACTIVITY_TIMEOUT = 1000000 * 1000; // 10 seconds
const ACCESS_TOKEN = async (data) => {
    const payload = { ...data };
    const accessToken = await jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: '100000s' });
    const refreshToken = jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: '100000s' });
    return { accessToken, refreshToken };
};
exports.ACCESS_TOKEN = ACCESS_TOKEN;
const refreshTokenHandler = async (refreshToken) => {
    if (!refreshToken) {
        throw new error_1.ForbiddenError('Access denied. No token provided');
    }
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, secretKey);
        const { dataValues } = payload;
        const newAccessToken = jsonwebtoken_1.default.sign(dataValues, secretKey, { expiresIn: '10000s' });
        const newRefreshToken = jsonwebtoken_1.default.sign(dataValues, secretKey, { expiresIn: '10000s' });
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
    catch (error) {
        throw new error_1.UnauthorizedError(`${error}`);
    }
};
exports.refreshTokenHandler = refreshTokenHandler;
const VERIFY_TOKEN = async (req, res, next) => {
    try {
        // Get access token from cookies
        const token = req.cookies?.accessToken;
        if (!token) {
            throw new error_1.ForbiddenError("Access denied. No token provided");
        }
        try {
            // Verify access token
            const decoded = jsonwebtoken_1.default.verify(token, secretKey);
            req.user = decoded; // attach user info to request
            return next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                // Access token expired → check refresh token
                const refreshToken = req.cookies?.refreshToken;
                if (!refreshToken) {
                    throw new error_1.NotFoundError("Refresh token missing");
                }
                // Optionally: verify refresh token and issue new access token here
                const { accessToken, refreshToken: newRefreshToken } = await (0, exports.refreshTokenHandler)(refreshToken);
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 5 * 60 * 1000,
                    sameSite: "strict",
                });
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    sameSite: "strict",
                });
                req.user = jsonwebtoken_1.default.verify(accessToken, secretKey);
                return next();
            }
            throw new error_1.UnauthorizedError("Invalid token");
        }
    }
    catch (error) {
        return res.status(401).json({ error: error.message });
    }
};
exports.VERIFY_TOKEN = VERIFY_TOKEN;
//# sourceMappingURL=token.js.map