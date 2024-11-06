import dayjs from "dayjs";

export const firstDayOfWeek = dayjs().startOf("week").toDate();
export const lastDayOfWeek = dayjs().endOf("week").toDate();
