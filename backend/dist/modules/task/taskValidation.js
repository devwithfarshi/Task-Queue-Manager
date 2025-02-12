"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const constant_1 = require("../../config/constant");
const createTask = zod_1.z.object({
    title: zod_1.z.string().min(3),
    description: zod_1.z.string().min(3),
    status: zod_1.z.enum(constant_1.TASK_STATUS).default('pending').optional().nullable(),
    priority: zod_1.z.enum(constant_1.TASK_PRIORITY).default('medium').optional().nullable(),
    dueDate: zod_1.z.string().optional().nullable()
});
exports.default = {
    createTask
};
