import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import {db} from "../db";
import {and, count, desc, eq, gte, lte, sql} from "drizzle-orm";
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
			.where(lte(goals.createdAt, lastDayOfWeek))
			.orderBy(desc(goals.createdAt)),
	);

	const goalCompletionCounts = db.$with("goal_completion_counts").as(
		db
			.select({
				goalId: goalCompletions.goalId,
				completionsCount: count(goalCompletions.id).as("completionsCount"),
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

	return db
		.with(goalsCreatedUpToWeek, goalCompletionCounts)
		.select({
			id: goalsCreatedUpToWeek.id,
			title: goalsCreatedUpToWeek.title,
			desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
			createdAt: goalsCreatedUpToWeek.createdAt,
			completionsCount: sql`
					coalesce(${goalCompletionCounts.completionsCount}, 0)
					`.mapWith(Number),
		})
		.from(goalsCreatedUpToWeek)
		.leftJoin(
			goalCompletionCounts,
			eq(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id),
		);
}
