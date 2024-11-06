"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGoalRoute = void 0;
const zod_1 = __importDefault(require("zod"));
const create_goal_1 = require("../../features/create-goal");
const createGoalRoute = async (app) => {
    app.post("/goals", {
        schema: {
            body: zod_1.default.object({
                title: zod_1.default.string(),
                desiredWeeklyFrequency: zod_1.default.number().int().min(1).max(7),
            }),
        },
    }, async (request) => {
        const { title, desiredWeeklyFrequency } = request.body;
        await (0, create_goal_1.createGoal)({
            title,
            desiredWeeklyFrequency,
        });
    });
};
exports.createGoalRoute = createGoalRoute;
