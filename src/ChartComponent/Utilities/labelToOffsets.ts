import { DataPoint, Range } from "../Interfaces";
import { maxValueForRange } from "./maxMin";

// we can add device width here in future for responsiveness
export const getMarginLeftByValue = (valueLength: number): string => {
  switch (valueLength) {
    case 1:
      return "2.7rem";
    case 2:
      return "3.3rem";
    case 3:
      return "5rem";
    case 4:
      return "5rem";
    default:
      return "5rem";
  }
};

export const getMarginRightByValue = (valueLength: number): number => {
  switch (valueLength) {
    case 1:
      return 53;
    case 2:
      return 62;
    case 3:
      return 70;
    case 4:
      return 85;
    default:
      return 85;
  }
};

export const getMarginLeftByData = (
  data: DataPoint[],
  range: Range
): number => {
  // if (data.length == 0) return 0;
  const value = maxValueForRange(data, range)?.toString().length;
  switch (value) {
    case 1:
      return 29;
    case 2:
      return 35;
    case 3:
      return 52;
    case 4:
      return 52;
    default:
      return 0;
  }
};
