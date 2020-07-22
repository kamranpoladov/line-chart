import { Range, DataPoint } from "../../Shared/Interfaces";

const labels = ['1 week', '2 weeks', '4 weeks', '2 months', '3 months', '6 months', 'All time'];

const getRangeButtonDates = (range: Range, label: string, data: DataPoint[]): Date => {
  switch (label) {
    case '1 week':
      return (new Date(
        range.rangeRight.getFullYear(),
        range.rangeRight.getMonth(),
        range.rangeRight.getDate() - 6
      ));
    case '2 weeks':
      return (new Date(
        range.rangeRight.getFullYear(),
        range.rangeRight.getMonth(),
        range.rangeRight.getDate() - 13
      ));
    case '4 weeks':
      return (new Date(
        range.rangeRight.getFullYear(),
        range.rangeRight.getMonth() - 1,
        range.rangeRight.getDate()
      ));
    case '2 months':
      return (new Date(
        range.rangeRight.getFullYear(),
        range.rangeRight.getMonth() - 2,
        range.rangeRight.getDate()
      ));
    case '3 months':
      return (new Date(
        range.rangeRight.getFullYear(),
        range.rangeRight.getMonth() - 3,
        range.rangeRight.getDate()
      ));
    case '6 months':
      return (new Date(
        range.rangeRight.getFullYear(),
        range.rangeRight.getMonth() - 6,
        range.rangeRight.getDate()
      ));
    case 'All time':
      return data[0].date;
    default:
      return (new Date(
        range.rangeRight.getFullYear(),
        range.rangeRight.getMonth(),
        range.rangeRight.getDate() - 6
      ));
  }
}

const isEnabled = (data: DataPoint[], date: Date, label: string) => {
  if ((data[0].date.getTime() > date.getTime()) && label != labels[labels.length - 1]) {
    return false;
  }
  return true;
}

export const getRangeButtons = (range: Range, data: DataPoint[]): Array<{ label: string, date: Date, isEnabled: boolean }> => {
  const result: Array<{ label: string, date: Date, isEnabled: boolean }> = [];
  for (let i = 0; i < labels.length; i++) {
    result.push({
      label: labels[i],
      date: getRangeButtonDates(range, labels[i], data),
      isEnabled: isEnabled(data, getRangeButtonDates(range, labels[i], data), labels[i])
    });
  }
  return result;
}