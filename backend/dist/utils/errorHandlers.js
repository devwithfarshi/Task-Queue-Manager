"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const ApiError_1 = __importDefault(require("./ApiError"));
/**
 * Middleware to handle 404 errors for routes that are not found.
 * Creates a new instance of ApiError with a 404 status code and "Route Not Found" message.
 * Passes the error to the next middleware, typically the error handler.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 */
const notFoundHandler = (req, res, next) => {
    const error = new ApiError_1.default(404, 'Route Not Found');
    next(error);
};
exports.notFoundHandler = notFoundHandler;
/**
 * Middleware to handle errors.
 * Handles Mongoose validation, duplicate key, and cast errors specifically.
 * If an ApiError is caught, it sends a structured response to the client.
 * Otherwise, it logs the error and returns a generic 500 Internal Server Error.
 *
 * @param err - The error object.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 */
const errorHandler = (err, req, res, next) => {
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((val) => val.message);
        err = new ApiError_1.default(400, 'Validation Error', messages);
    }
    // Handle Mongoose duplicate key errors
    if (err.code && err.code === 11000) {
        const message = 'Duplicate field value entered';
        err = new ApiError_1.default(400, message);
    }
    // Handle Mongoose cast errors
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        err = new ApiError_1.default(404, message);
    }
    // If the error is an instance of ApiError, send the structured response
    if (err instanceof ApiError_1.default) {
        res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors
        });
    }
    // Log unexpected errors and respond with a generic 500 error
    console.error(err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
};
exports.errorHandler = errorHandler;
