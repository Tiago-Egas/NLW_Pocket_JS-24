"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeekPendingGoals = getWeekPendingGoals;
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../db/schema");
const utils_1 = require("./utils");
async function getWeekPendingGoals() {
    const goalsCreatedUpToWeek = db_1.db.$with("goals_created_up_to_week").as(db_1.db
        .select({
        id: schema_1.goals.id,
        title: schema_1.goals.title,
        desiredWeeklyFrequency: schema_1.goals.desiredWeeklyFrequency,
        createdAt: schema_1.goals.createdAt,
    })
        .from(schema_1.goals)
        .where((0, drizzle_orm_1.lte)(schema_1.goals.createdAt, utils_1.lastDayOfWeek))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.goals.createdAt)));
    const goalCompletionCounts = db_1.db.$with("goal_completion_counts").as(db_1.db
        .select({
        goalId: schema_1.goalCompletions.goalId,
        completionCount: (0, drizzle_orm_1.count)(schema_1.goalCompletions.id).as("completionCount"),
    })
        .from(schema_1.goalCompletions)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.goalCompletions.createdAt, utils_1.firstDayOfWeek), (0, drizzle_orm_1.lte)(schema_1.goalCompletions.createdAt, utils_1.lastDayOfWeek)))
        .groupBy(schema_1.goalCompletions.goalId, schema_1.goalCompletions.createdAt)
        .orderBy((0, drizzle_orm_1.desc)(schema_1.goalCompletions.createdAt)));
    const pendingGoals = await db_1.db
        .with(goalsCreatedUpToWeek, goalCompletionCounts)
        .select({
        id: goalsCreatedUpToWeek.id,
        title: goalsCreatedUpToWeek.title,
        desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
        createdAt: goalsCreatedUpToWeek.createdAt,
        completionCount: (0, drizzle_orm_1.sql) `
					coalesce(${goalCompletionCounts.completionCount}, 0)
					`.mapWith(Number),
    })
        .from(goalsCreatedUpToWeek)
        .leftJoin(goalCompletionCounts, (0, drizzle_orm_1.eq)(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id));
    return { pendingGoals };
}
