import { Range, DataPoint } from "../Interfaces";
import { startOfDay } from "date-fns";

export const filterData = (
  range: Range,
  data: DataPoint[],
  isMobile: boolean
): DataPoint[] => {
  if (data.length == 0) return [];
  const desiredAmountOfDataPoints = isMobile ? 50 : 100;
  const amountOfDataPoints = data.filter(
    (dataPoint) =>
      startOfDay(dataPoint.date) >= startOfDay(range.rangeLeft) &&
      startOfDay(dataPoint.date) <= startOfDay(range.rangeRight)
  ).length;

  if (amountOfDataPoints >= desiredAmountOfDataPoints) {
    return data
      .filter((_, i) => {
        const skip = Math.round(amountOfDataPoints / desiredAmountOfDataPoints);
        if (i == data.length - 1) return true;
        return i % skip == 0;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(({ value, date }) => ({ value, date: startOfDay(date) }));
  }

  return data
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(({ value, date }) => ({ value, date: startOfDay(date) }));
};
