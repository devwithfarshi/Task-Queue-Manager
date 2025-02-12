"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("./userController"));
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const userValidation_1 = __importDefault(require("./userValidation"));
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
const router = express_1.default.Router();
router.post('/register', (0, validationMiddleware_1.validate)(userValidation_1.default.userRegistrationSchema), userController_1.default.createUser);
router.post('/login', (0, validationMiddleware_1.validate)(userValidation_1.default.userLoginSchema), userController_1.default.userSignIn);
router.get('/me', authMiddleware_1.default, userController_1.default.me);
exports.default = router;
