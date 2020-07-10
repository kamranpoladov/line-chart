import { Range } from '../../Interfaces/index';

const week = 6 * Math.pow(10, 8);
const month = 24 * Math.pow(10, 8);

// This is incomplete!
// Will return proper date format according to given range
export const rangeToFormat = (range: Range): string => {
    const timeDifference = range.rangeRight.getTime() - range.rangeLeft.getTime();
    if (timeDifference < month) {
        return '%d %b';
    } else {
        return '%d';
    }
};