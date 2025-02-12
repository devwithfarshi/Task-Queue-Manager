"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskQueue = void 0;
require("dotenv/config");
const bullmq_1 = require("bullmq");
exports.taskQueue = new bullmq_1.Queue('task-queue', {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
    }
});
