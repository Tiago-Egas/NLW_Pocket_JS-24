import fastify from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import {createGoalRoute} from "./Routes/create-goal";
import {createCompletionRoute} from "./Routes/create-completion";
import {getPendingGoalsRoute} from "./Routes/get-pending-goals";
import {getWeekSummaryRoute} from "./Routes/get-week-summary";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createGoalRoute);
app.register(createCompletionRoute);
app.register(getPendingGoalsRoute);
app.register(getWeekSummaryRoute);

app
	.listen({
		port: 3333,
	})
	.then(() => {
		console.log("Server is running on port 3333");
	});
