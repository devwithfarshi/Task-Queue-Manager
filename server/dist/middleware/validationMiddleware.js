"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
function validate(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const errorMessage = error.errors.map((issue) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`
                }));
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: 'Invalid data',
                    errors: errorMessage
                });
            }
            else {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: 'Internal server error'
                });
            }
        }
    };
}
