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
const hashText_1 = require("../../utils/hashText");
const userModel_1 = __importDefault(require("./userModel"));
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const hashPassword = yield (0, hashText_1.hashText)(data.password);
    data.password = hashPassword;
    // Manual Email Verification
    const isAlreadyExist = yield userModel_1.default.findOne({ email: data.email });
    if (isAlreadyExist) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, 'You already register with this email address');
    }
    const save = yield userModel_1.default.create(Object.assign(Object.assign({}, data), { role: 'user' }));
    if (!save || save === null) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "User Info can't save, their might be an issues while data");
    }
    //   TODO: Send Email Verification Link
    return save;
});
const findUser = (identifier) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({
        $or: [{ _id: identifier }, { email: identifier }]
    }).select('-password');
    if (!user || user === null) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    return user;
});
// get User profile
const me = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(userId).select('-password');
    if (!user || user === null) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    return user;
});
// Sign In User
const signInUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let user = null;
    user = yield userModel_1.default.findOne(((_a = data.username) === null || _a === void 0 ? void 0 : _a.length) > 0
        ? { username: data.username }
        : { email: data.email }).select('+password');
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Credentials not match');
    }
    const isPasswordMatch = yield (0, hashText_1.verifyHash)(data.password, user.password);
    if (!isPasswordMatch) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Credentials not match');
    }
    return user;
});
exports.default = {
    createUser,
    findUser,
    signInUser,
    me
};
