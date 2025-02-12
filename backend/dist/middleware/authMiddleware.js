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
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const jwtToken_1 = require("../utils/jwtToken");
const userServices_1 = __importDefault(require("../modules/user/userServices"));
const extractToken = (req) => {
    let token = null;
    if (req.headers.authorization) {
        token =
            typeof req.headers.authorization === 'string' &&
                req.headers.authorization.startsWith('Bearer')
                ? req.headers.authorization.split(' ')[1]
                : null;
    }
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    else if (req.headers['x-access-token']) {
        token = req.headers['x-access-token'];
    }
    return token;
};
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = extractToken(req);
    if (!token) {
        return next(new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Access denied. No token provided'));
    }
    try {
        const decoded = (0, jwtToken_1.verifyAccessToken)(token);
        const userExits = yield userServices_1.default.findUser(decoded._id);
        if (!userExits) {
            return next(new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid or expire token'));
        }
        req.user = userExits;
        next();
    }
    catch (err) {
        console.log(`Error while verifying token: ${err}`);
        return next(new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid or expire token provided'));
    }
});
exports.default = authenticate;
