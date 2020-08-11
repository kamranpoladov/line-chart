import { Range, DataPoint } from "../Interfaces";

export const dataWithinRange = (data: DataPoint[], range: Range): boolean => {
  if (data.length == 0) return false;
  
  return data.some(
    (dataPoint) => dataPoint.date <= range.rangeRight && dataPoint.date >= range.rangeLeft
    );
}