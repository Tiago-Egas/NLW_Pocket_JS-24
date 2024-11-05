"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
const _1 = require(".");
const dayjs_1 = __importDefault(require("dayjs"));
async function seed() {
    await _1.db.delete(schema_1.goalCompletions);
    await _1.db.delete(schema_1.goals);
    const result = await _1.db
        .insert(schema_1.goals)
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
    const startOfWeek = (0, dayjs_1.default)().startOf("week");
    await _1.db.insert(schema_1.goalCompletions).values([
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
    _1.client.end().then(() => console.log("Seed finished"));
});
