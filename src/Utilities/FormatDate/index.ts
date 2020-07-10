import * as d3 from 'd3';
import { Range, Step } from '../../Interfaces/index';
import { timeStamps, weekDiff, monthDiff, yearDiff } from '../Services/index';

export const rangeToFormat = (range: Range): string => {
    const timeDifference = range.rangeRight.getTime() - range.rangeLeft.getTime();
    if (timeDifference <= 6 * timeStamps.month) {
        return '%d %b';
    } else if (timeDifference <= 4 * timeStamps.year) {
        return '%b %Y';
    } else {
        return '%Y';
    }
};

export const rangeToStep = (range: Range): Step => {
    const timeDifference = range.rangeRight.getTime() - range.rangeLeft.getTime();
    if (timeDifference <= timeStamps.month) {
        return {
            interval: d3.timeDay,
            every: weekDiff(range.rangeLeft, range.rangeRight)
        }
    } else if (timeDifference <= timeStamps.month * 6) {
        return {
            interval: d3.timeWeek,
            every: monthDiff(range.rangeLeft, range.rangeRight)
        }
    } else if (timeDifference <= timeStamps.year * 4) {
        return {
            interval: d3.timeMonth,
            every: yearDiff(range.rangeLeft, range.rangeRight) * 2
        }
    } else {
        return {
            interval: d3.timeYear,
            every: 1
        }
    }
};