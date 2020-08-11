import { Range, DataPoint } from "../Interfaces";
import { max, min } from 'd3';

export const maxValueForRange = (data: DataPoint[], range: Range): number => {
  return max(data, (d) => {
    if (d.date >= range.rangeLeft && d.date <= range.rangeRight) {
      return d.value;
    }
  }) as number;
};

export const minValueForRange = (data: DataPoint[], range: Range): number => {
  return min(data, (d) => {
    if (d.date >= range.rangeLeft && d.date <= range.rangeRight) {
      return d.value;
    }
  }) as number;
};

export const maxDateForRange = (data: DataPoint[], range: Range): Date => {
  return max(data, (d) => {
    if (d.date >= range.rangeLeft && d.date <= range.rangeRight) {
      return d.date;
    }
  }) as Date;
};

export const minDateForRange = (data: DataPoint[], range: Range): Date => {
  return min(data, (d) => {
    if (d.date >= range.rangeLeft && d.date <= range.rangeRight) {
      return d.date;
    }
  }) as Date;
};