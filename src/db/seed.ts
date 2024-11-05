import {goalCompletions, goals} from "./schema";
import {client, db} from ".";
import dayjs from "dayjs";

async function seed() {
	await db.delete(goalCompletions);
	await db.delete(goals);

	const result = await db
		.insert(goals)
		.values([
			{ title: "Learn to play the guitar", desiredWeeklyFrequency: 3 },
			{ title: "Learn to cook", desiredWeeklyFrequency: 2 },
			{ title: "Learn to dance", desiredWeeklyFrequency: 1 },
			{ title: "Learn to code", desiredWeeklyFrequency: 5 },
			{ title: "Learn to draw", desiredWeeklyFrequency: 4 },
			{ title: "Learn to sing", desiredWeeklyFrequency: 3 },
			{ title: "Learn to write", desiredWeeklyFrequency: 2 },
			{ title: "Learn to meditate", desiredWeeklyFrequency: 1 },
			{ title: "Learn to swim", desiredWeeklyFrequency: 5 },
			{ title: "Learn to speak in public", desiredWeeklyFrequency: 4 },
		])
		.returning();

	const startOfWeek = dayjs().startOf("week");

	await db.insert(goalCompletions).values([
		{
			goalId: result[0].id,
			createdAt: startOfWeek.toDate(),
		},
		{
			goalId: result[1].id,
			createdAt: startOfWeek.add(1, "day").toDate(),
		},
	]);
}

seed().finally(() => {
	client.end().then(() => console.log("Seed finished"));
});
