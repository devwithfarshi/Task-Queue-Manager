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
const taskModel_1 = __importDefault(require("./taskModel"));
const createTask = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield taskModel_1.default.create(data);
});
const getTasks = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filter = {}) {
    return yield taskModel_1.default.find(filter).populate('userId', 'username email role');
});
const getTaskById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield taskModel_1.default.findById(id).populate('userId'));
});
const updateTask = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield taskModel_1.default.findByIdAndUpdate(id, data, {
        new: true
    });
});
const deleteTask = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield taskModel_1.default.findByIdAndDelete(id);
});
exports.default = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};
