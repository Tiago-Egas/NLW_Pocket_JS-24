"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const create_goal_1 = require("./Routes/create-goal");
const create_completion_1 = require("./Routes/create-completion");
const get_pending_goals_1 = require("./Routes/get-pending-goals");
const get_week_summary_1 = require("./Routes/get-week-summary");
const app = (0, fastify_1.default)().withTypeProvider();
app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
app.register(create_goal_1.createGoalRoute);
app.register(create_completion_1.createCompletionRoute);
app.register(get_pending_goals_1.getPendingGoalsRoute);
app.register(get_week_summary_1.getWeekSummaryRoute);
app
    .listen({
    port: 3333,
})
    .then(() => {
    console.log("Server is running on port 3333");
});
