"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const userRegistrationSchema = zod_1.z.object({
    username: zod_1.z.string().trim().min(3),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8)
});
const userLoginSchema = zod_1.z
    .object({
    username: zod_1.z.string().min(3).optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(8)
})
    .refine((data) => data.username || data.email, {
    message: 'required',
    path: ['email']
});
exports.default = { userRegistrationSchema, userLoginSchema };
