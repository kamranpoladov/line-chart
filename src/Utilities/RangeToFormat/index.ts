import { Range } from '../../Interfaces/index';

// This is incomplete!
// Will return proper date format according to given range
export const rangeToFormat = (range: Range): string => {
    const timeDifference = range.rangeRight.getTime() - range.rangeLeft.getTime();
    console.log(range, timeDifference);
    if (timeDifference < 6 * Math.pow(10, 8)) {
        return '%d %b';
    } else {
        return '%Y';
    }
};