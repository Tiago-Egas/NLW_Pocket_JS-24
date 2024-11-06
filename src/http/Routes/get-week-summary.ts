import type {FastifyPluginAsyncZod} from "fastify-type-provider-zod";
import {getWeekSummary} from "../../features/get-week-summary";

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async (app) => {
	app.get("/summary", async () => {
		return await getWeekSummary();
	});
};
