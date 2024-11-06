import {db} from "../db";
import {goals} from "../db/schema";
import {CreateGoalRequest} from "../interfaces/goal";

export async function createGoal({
	title,
	desiredWeeklyFrequency,
}: CreateGoalRequest) {
	const result = await db
		.insert(goals)
		.values({
			title,
			desiredWeeklyFrequency,
		})
		.returning();

	const goal = result[0];

	return {
		goal,
	};
}
