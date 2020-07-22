import { Range, DataPoint } from "../Interfaces";

export const filterData = (range: Range, data: DataPoint[], isMobile: boolean): DataPoint[] => {
  const desiredAmountOfDataPoints = isMobile ? 50 : 100;
  const amountOfDataPoints = data.filter((dataPoint) =>
    dataPoint.date >= range.rangeLeft && dataPoint.date <= range.rangeRight
  ).length;

  if (amountOfDataPoints >= desiredAmountOfDataPoints) {
    return data.filter((_, i) => {
      const skip = Math.round(amountOfDataPoints / desiredAmountOfDataPoints);
      return i % skip == 0;
    });
  }
  return data;
}