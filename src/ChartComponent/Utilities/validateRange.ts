import { DataPoint, Range } from '../Interfaces';
import { minDateForRange, maxDateForRange } from './maxMin';
import { startOfDay } from 'date-fns';

export const validateRange = (data: DataPoint[], range: Range): Range => {
  if (data.length == 0) return range;
  const sortedData = data.sort((a, b) => a.date.getTime() - b.date.getTime());
  const fixedRange: Range = {
    rangeLeft: startOfDay(range.rangeLeft),
    rangeRight: startOfDay(range.rangeRight)
  };
  const maxDate = maxDateForRange(sortedData, fixedRange);
  const minDate = minDateForRange(sortedData, fixedRange);
  const newRange: Range = {
    rangeLeft: fixedRange.rangeLeft < minDate ? minDate : fixedRange.rangeLeft,
    rangeRight: fixedRange.rangeRight > maxDate ? maxDate : fixedRange.rangeRight
  };
  return newRange;
};
