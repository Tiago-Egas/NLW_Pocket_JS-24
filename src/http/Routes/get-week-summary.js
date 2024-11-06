"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeekSummaryRoute = void 0;
const get_week_summary_1 = require("../../features/get-week-summary");
const getWeekSummaryRoute = async (app) => {
    app.get("/summary", async () => {
        return await (0, get_week_summary_1.getWeekSummary)();
    });
};
exports.getWeekSummaryRoute = getWeekSummaryRoute;
