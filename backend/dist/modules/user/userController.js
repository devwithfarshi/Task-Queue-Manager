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
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const ApiResponse_1 = __importDefault(require("../../utils/ApiResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const userServices_1 = __importDefault(require("./userServices"));
const jwtToken_1 = require("../../utils/jwtToken");
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userServices_1.default.createUser(req.body);
    if (!user || user === null) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong');
    }
    res
        .status(http_status_codes_1.StatusCodes.CREATED)
        .json(new ApiResponse_1.default(http_status_codes_1.StatusCodes.CREATED, { _id: user._id }, 'User created successfully'));
}));
const userSignIn = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userServices_1.default.signInUser(req.body);
    if (!user || user === null) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong');
    }
    const accessToken = (0, jwtToken_1.generateAccessToken)(user);
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .cookie('token', accessToken)
        .json(new ApiResponse_1.default(http_status_codes_1.StatusCodes.OK, { _id: user._id, accessToken }, 'User signed in successfully'));
}));
const me = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || req.user === null) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Unauthorized');
    }
    const user = yield userServices_1.default.me(req.user._id);
    if (!user || user === null) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json(new ApiResponse_1.default(http_status_codes_1.StatusCodes.OK, user, 'User profile'));
}));
exports.default = {
    createUser,
    userSignIn,
    me
};
