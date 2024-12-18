"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
(0, db_1.default)();
// Start the server
const PORT = process.env.PORT || 3000;
http_1.default.createServer(app_1.default).listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
