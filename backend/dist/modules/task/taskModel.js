"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constant_1 = require("../../config/constant");
const TaskSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: constant_1.TASK_STATUS,
        default: 'pending'
    },
    priority: {
        type: String,
        enum: constant_1.TASK_PRIORITY,
        default: 'medium'
    },
    dueDate: { type: Date },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });
const TaskModel = (0, mongoose_1.model)('Task', TaskSchema);
exports.default = TaskModel;
