"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lastDayOfWeek = exports.firstDayOfWeek = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
exports.firstDayOfWeek = (0, dayjs_1.default)().startOf("week").toDate();
exports.lastDayOfWeek = (0, dayjs_1.default)().endOf("week").toDate();
