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
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const taskService_1 = __importDefault(require("./taskService"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const ApiResponse_1 = __importDefault(require("../../utils/ApiResponse"));
const queueServices_1 = require("../../Queues/queueServices");
const createTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const task = yield taskService_1.default.createTask(Object.assign(Object.assign({}, req.body), { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }));
    if (!task) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Task not created');
    }
    yield queueServices_1.taskQueue.add('task', {
        taskId: task._id.toString()
    });
    res
        .status(http_status_codes_1.StatusCodes.CREATED)
        .json(new ApiResponse_1.default(http_status_codes_1.StatusCodes.CREATED, task, 'Task created successfully'));
}));
const getTasks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield taskService_1.default.getTasks();
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json(new ApiResponse_1.default(http_status_codes_1.StatusCodes.OK, tasks, 'Tasks fetched successfully'));
}));
const getTaskById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield taskService_1.default.getTaskById(req.params.id);
    if (!task) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Task not found');
    }
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json(new ApiResponse_1.default(http_status_codes_1.StatusCodes.OK, task, 'Task fetched successfully'));
}));
const getTasksByUserId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield taskService_1.default.getTasks({
        userId: req.params.userId.toString()
    });
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json(new ApiResponse_1.default(http_status_codes_1.StatusCodes.OK, tasks, 'Tasks fetched successfully'));
}));
const updateTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield taskService_1.default.updateTask(req.params.id, req.body);
    if (!task) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Task not updated, try again');
    }
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json(new ApiResponse_1.default(http_status_codes_1.StatusCodes.OK, task, 'Task updated successfully'));
}));
const cancelTaskStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield taskService_1.default.getTaskById(req.params.id);
    if (!task || !task._id) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Task not found');
    }
    if (task.status === 'completed') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'This task is already completed');
    }
    if (task.status === 'canceled') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'This task is already canceled');
    }
    yield queueServices_1.taskQueue.remove(task._id.toString());
    task.status = 'canceled';
    if (!task._id) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Task ID is undefined');
    }
    const updatedTask = yield taskService_1.default.updateTask(task._id.toString(), task);
    if (!updatedTask) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to update task');
    }
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json(new ApiResponse_1.default(http_status_codes_1.StatusCodes.OK, updatedTask, 'Task canceled successfully'));
}));
const deleteTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield taskService_1.default.deleteTask(req.params.id);
    if (!task) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Task not deleted, try again');
    }
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json(new ApiResponse_1.default(http_status_codes_1.StatusCodes.OK, task, 'Task deleted successfully'));
}));
const getTaskQueueStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const counts = yield queueServices_1.taskQueue.getJobCounts();
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json(new ApiResponse_1.default(http_status_codes_1.StatusCodes.OK, counts, 'Task Queue Status'));
}));
exports.default = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTasksByUserId,
    cancelTaskStatus,
    getTaskQueueStatus
};
