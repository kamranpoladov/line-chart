import { DataPoint, Range } from "../Interfaces";
import { subDays, subWeeks, subMonths, startOfDay } from "date-fns";

const labels = [
  "1 week",
  "2 weeks",
  "4 weeks",
  "2 months",
  "3 months",
  "6 months",
  "All time",
];

const getRangeButtonDates = (
  range: Range,
  label: string,
  data: DataPoint[]
): Date => {
  switch (label) {
    case "1 week":
      return subDays(range.rangeRight, 6);
    case "2 weeks":
      return subWeeks(range.rangeRight, 2);
    case "4 weeks":
      return subMonths(range.rangeRight, 1);
    case "2 months":
      return subMonths(range.rangeRight, 2);
    case "3 months":
      return subMonths(range.rangeRight, 3);
    case "6 months":
      return subMonths(range.rangeRight, 6);
    case "All time":
      return data.length ? data[0].date : startOfDay(new Date());
    default:
      return subDays(range.rangeRight, 6);
  }
};

const isEnabled = (data: DataPoint[], date: Date, label: string) => {
  if (!data.length) return false;

  if (
    data[0].date.getTime() > date.getTime() &&
    label != labels[labels.length - 1]
  ) {
    return false;
  }
  return true;
};

export const getRangeButtons = (
  range: Range,
  data: DataPoint[]
): Array<{ label: string; date: Date; isEnabled: boolean }> => {
  const result: Array<{ label: string; date: Date; isEnabled: boolean }> = [];
  for (let i = 0; i < labels.length; i++) {
    result.push({
      label: labels[i],
      date: getRangeButtonDates(range, labels[i], data),
      isEnabled: isEnabled(
        data,
        getRangeButtonDates(range, labels[i], data),
        labels[i]
      ),
    });
  }
  return result;
};
