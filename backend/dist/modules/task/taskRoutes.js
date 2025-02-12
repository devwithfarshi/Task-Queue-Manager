"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminMiddleware_1 = __importDefault(require("../../middleware/adminMiddleware"));
const express_1 = require("express");
const taskController_1 = __importDefault(require("./taskController"));
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
const taskValidation_1 = __importDefault(require("./taskValidation"));
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const hasPermission_1 = __importDefault(require("../../middleware/hasPermission"));
const router = (0, express_1.Router)();
router.post('/create', authMiddleware_1.default, (0, validationMiddleware_1.validate)(taskValidation_1.default.createTask), taskController_1.default.createTask);
// get all tasks by user id ; only admin or owner of the task can view
router.get('/:userId', authMiddleware_1.default, (0, hasPermission_1.default)(['admin']), taskController_1.default.getTasksByUserId);
// get task by id ; only admin or owner of the task can view
router.get('/:id/user/:userId', authMiddleware_1.default, (0, hasPermission_1.default)(['admin']), taskController_1.default.getTaskById);
// update task by id ; only admin or owner of the task can update
router.put('/:id/user/:userId', authMiddleware_1.default, (0, hasPermission_1.default)(['admin']), taskController_1.default.updateTask);
// cancel task by id ; only admin
router.patch('/:id/cancel', authMiddleware_1.default, adminMiddleware_1.default, taskController_1.default.cancelTaskStatus);
// get all task by admin
router.get('/get/all-tasks', authMiddleware_1.default, adminMiddleware_1.default, taskController_1.default.getTasks);
router.get('/queue/status', authMiddleware_1.default, adminMiddleware_1.default, taskController_1.default.getTaskQueueStatus);
exports.default = router;
