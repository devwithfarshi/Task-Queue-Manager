"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_codes_1 = require("http-status-codes");
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const hpp_1 = __importDefault(require("hpp"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandlers_1 = require("./utils/errorHandlers");
const ApiResponse_1 = __importDefault(require("./utils/ApiResponse"));
const app = (0, express_1.default)();
// middleware
const allMiddleware = [
    (0, morgan_1.default)(process.env.LOGGER_LEVEL === 'development' ? 'dev' : 'combined'),
    (0, helmet_1.default)(),
    (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 20000
    }),
    (0, express_mongo_sanitize_1.default)(),
    (0, hpp_1.default)(),
    express_1.default.json(),
    express_1.default.urlencoded({ extended: true }),
    (0, cookie_parser_1.default)(),
    (0, cors_1.default)()
];
app.use(allMiddleware);
// base route
app.get('/', (_, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json(new ApiResponse_1.default(http_status_codes_1.StatusCodes.OK, {
        message: 'Welcome to the Task Queue Manager API😀',
        status: 'Success✅',
        server_status: 'Working🆙',
        server_time: `${new Date().toLocaleString()}⌛`
    }));
});
// routes
// error handlers
app.use(errorHandlers_1.notFoundHandler);
app.use(errorHandlers_1.errorHandler);
exports.default = app;
