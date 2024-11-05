import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import {db} from "../db";
import {and, count, desc, gte, lte} from "drizzle-orm";
import {goalCompletions, goals} from "../db/schema";

dayjs.extend(weekOfYear);

export async function getWeekPendingGoals() {
	const firstDayOfWeek = dayjs().startOf("week").toDate();
	const lastDayOfWeek = dayjs().endOf("week").toDate();

	const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
		db
			.select({
				id: goals.id,
				title: goals.title,
				desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
				createdAt: goals.createdAt,
			})
			.from(goals)
			.where(lte(goals.createdAt, lastDayOfWeek)),
	);

	const goalCompletionCounts = db.$with("goal_completion_counts").as(
		db
			.select({
				goalId: goalCompletions.goalId,
				completionsCount: count(goalCompletions.id),
			})
			.from(goalCompletions)
			.where(
				and(
					gte(goals.createdAt, firstDayOfWeek),
					lte(goals.createdAt, lastDayOfWeek),
				),
			)
			.groupBy(goalCompletions.goalId)
			.orderBy(desc(goalCompletions.id)),
	);

	const pendingGoals = await db
		.with(goalsCreatedUpToWeek, goalCompletionCounts)
		.select()
		.from(goalsCreatedUpToWeek)
		.toSQL();

	return { pendingGoals };
}
