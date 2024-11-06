"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingGoalsRoute = void 0;
const get_week_pending_goals_1 = require("../../features/get-week-pending-goals");
const getPendingGoalsRoute = async (app) => {
    app.get("/pending-goals", async () => {
        return (0, get_week_pending_goals_1.getWeekPendingGoals)();
    });
};
exports.getPendingGoalsRoute = getPendingGoalsRoute;
