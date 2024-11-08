import {db} from "../db";
import {and, count, desc, eq, gte, lte, sql} from "drizzle-orm";
import {goalCompletions, goals} from "../db/schema";
import {firstDayOfWeek, lastDayOfWeek} from "./utils";

export async function getWeekPendingGoals() {
	const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
		db
			.select({
				id: goals.id,
				title: goals.title,
				desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
				createdAt: goals.createdAt,
			})
			.from(goals)
			.where(lte(goals.createdAt, lastDayOfWeek))
			.orderBy(desc(goals.createdAt)),
	);

	const goalCompletionCounts = db.$with("goal_completion_counts").as(
		db
			.select({
				goalId: goalCompletions.goalId,
				completionCount: count(goalCompletions.id).as("completionCount"),
			})
			.from(goalCompletions)
			.where(
				and(
					gte(goalCompletions.createdAt, firstDayOfWeek),
					lte(goalCompletions.createdAt, lastDayOfWeek),
				),
			)
			.groupBy(goalCompletions.goalId, goalCompletions.createdAt)
			.orderBy(desc(goalCompletions.createdAt)),
	);

	const pendingGoals = await db
		.with(goalsCreatedUpToWeek, goalCompletionCounts)
		.select({
			id: goalsCreatedUpToWeek.id,
			title: goalsCreatedUpToWeek.title,
			desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
			createdAt: goalsCreatedUpToWeek.createdAt,
			completionCount: sql`
					coalesce(${goalCompletionCounts.completionCount}, 0)
					`.mapWith(Number),
		})
		.from(goalsCreatedUpToWeek)
		.leftJoin(
			goalCompletionCounts,
			eq(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id),
		);

	return { pendingGoals };
}
