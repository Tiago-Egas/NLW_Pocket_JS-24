import fastify from "fastify";
import {createGoal} from "../features/create-goal";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import z from "zod";
import {getWeekPendingGoals} from "../features/get-week-pending-goals";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get("/pending-goals", async () => {
	const { pendingGoals } = await getWeekPendingGoals();

	return { pendingGoals };
});

app.post(
	"/goals",
	{
		schema: {
			body: z.object({
				title: z.string(),
				desiredWeeklyFrequency: z.number().int().min(1).max(7),
			}),
		},
	},
	async (request) => {
		const { title, desiredWeeklyFrequency } = request.body;

		await createGoal({
			title,
			desiredWeeklyFrequency,
		});
	},
);

app
	.listen({
		port: 3333,
	})
	.then(() => {
		console.log("Server is running on port 3333");
	});
