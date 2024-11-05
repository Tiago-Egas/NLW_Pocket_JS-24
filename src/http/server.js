"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const create_goal_1 = require("../features/create-goal");
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const zod_1 = __importDefault(require("zod"));
const get_week_pending_goals_1 = require("../features/get-week-pending-goals");
const create_goal_completion_1 = require("../features/create-goal-completion");
const app = (0, fastify_1.default)().withTypeProvider();
app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
app.get("/pending-goals", async () => {
    return (0, get_week_pending_goals_1.getWeekPendingGoals)();
});
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
app.post("/completions", {
    schema: {
        body: zod_1.default.object({
            goalId: zod_1.default.string(),
        }),
    },
}, async (request) => {
    const { goalId } = request.body;
    await (0, create_goal_completion_1.createGoalCompletion)({
        goalId,
    });
});
app
    .listen({
    port: 3333,
})
    .then(() => {
    console.log("Server is running on port 3333");
});
