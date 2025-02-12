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
require("dotenv/config");
const bullmq_1 = require("bullmq");
const taskModel_1 = __importDefault(require("../modules/task/taskModel"));
const worker = new bullmq_1.Worker('task-queue', (job) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Processing job', job.id);
    const task = yield taskModel_1.default.findById(job.data.taskId);
    if (!task) {
        throw new Error('Task not found');
    }
    task.status = 'in-progress';
    yield new Promise((resolve) => setTimeout(resolve, 10000));
    task.status = 'completed';
    yield task.save();
    console.log('Completed job', job.id);
}), {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
    }
});
worker.on('failed', (job) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield taskModel_1.default.findById(job === null || job === void 0 ? void 0 : job.data.taskId);
    if (task) {
        task.status = 'failed';
        yield task.save();
    }
}));
