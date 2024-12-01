"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message = 'Something went wrong', errors = [], stack) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    /**
     * Creates a new ApiError instance with the specified status code and message.
     */
    static createError(statusCode, message, errors = []) {
        return new ApiError(statusCode, message, errors);
    }
    /**
     * Creates a bad request error (HTTP 400).
     */
    static badRequest(message, errors = []) {
        return ApiError.createError(400, message, errors);
    }
    /**
     * Creates a not found error (HTTP 404).
     */
    static notFound(message, errors = []) {
        return ApiError.createError(404, message, errors);
    }
    /**
     * Creates a forbidden error (HTTP 403).
     */
    static forbidden(message, errors = []) {
        return ApiError.createError(403, message, errors);
    }
    /**
     * Creates an unauthorized error (HTTP 401).
     */
    static unauthorized(message, errors = []) {
        return ApiError.createError(401, message, errors);
    }
    /**
     * Creates a conflict error (HTTP 409).
     */
    static conflict(message, errors = []) {
        return ApiError.createError(409, message, errors);
    }
    /**
     * Creates an internal server error (HTTP 500).
     */
    static internal(message, errors = []) {
        return ApiError.createError(500, message, errors);
    }
}
exports.ApiError = ApiError;
exports.default = ApiError;
