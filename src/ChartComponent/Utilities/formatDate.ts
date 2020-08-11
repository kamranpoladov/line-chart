import * as d3 from 'd3';
import { Range, Step } from '../Interfaces/index';
import { differenceInWeeks, differenceInMonths, differenceInYears } from 'date-fns';

const getInterval = (
  timeFrame: d3.CountableTimeInterval, 
  rangeLeft: Date, 
  rangeRight: Date,
  difference: (d1: Date, d2: Date) => number): d3.TimeInterval => {
  return timeFrame.filter((d) => timeFrame.count(rangeLeft, d) % (difference(rangeRight, rangeLeft) || 1) == 0)
}

export const rangeToFormat = (range: Range): string => {
  const { rangeLeft, rangeRight } = range;
  console.log(range);
  if (differenceInMonths(rangeRight, rangeLeft) <= 12) {
    return '%d.%m';
  } else {
    return '%Y';
  }
};

export const rangeToStep = (range: Range): Step => {
  const { rangeLeft, rangeRight } = range;
  if (differenceInWeeks(rangeRight, rangeLeft) < 1) {
    return {
      intervalFunction: getInterval(d3.timeDay, rangeLeft, rangeRight, () => 1)
    };
  } else if (differenceInMonths(rangeRight, rangeLeft) < 1) {
    return {
      intervalFunction: getInterval(d3.timeDay, rangeLeft, rangeRight, differenceInWeeks)
    };
  } else if (differenceInMonths(rangeRight, rangeLeft) <= 12) {
    return {
      intervalFunction: getInterval(d3.timeWeek, rangeLeft, rangeRight, differenceInMonths)
    };
  } else if (differenceInYears(rangeRight, rangeLeft) <= 9) {
    return {
      intervalFunction: getInterval(d3.timeYear, rangeLeft, rangeRight, () => 1)
    };
  }
  else {
    return {
      intervalFunction: getInterval(d3.timeYear, rangeLeft, rangeRight, () => 2),
    };
  }
};