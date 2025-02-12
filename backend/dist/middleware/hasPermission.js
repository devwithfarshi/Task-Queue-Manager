"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const hasPermission = (allowedRoles = []) => (req, res, next) => {
    var _a, _b, _c;
    if (((_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) !== req.params.userId) {
        if (!allowedRoles.includes((_c = req.user) === null || _c === void 0 ? void 0 : _c.role)) {
            return next(new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Access denied. You are not allowed to view other user tasks'));
        }
    }
    next();
};
exports.default = hasPermission;
