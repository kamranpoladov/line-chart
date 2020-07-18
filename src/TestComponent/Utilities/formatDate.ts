import * as d3 from 'd3';
import { Range, Step } from '../../Shared/Interfaces/index';
import moment from 'moment';

export const rangeToFormat = (range: Range): string => {
    const rangeLeftMoment = moment([
        range.rangeLeft.getFullYear(), 
        range.rangeLeft.getMonth(), 
        range.rangeLeft.getDate()]);
    const rangeRightMoment = moment([
        range.rangeRight.getFullYear(), 
        range.rangeRight.getMonth(), 
        range.rangeRight.getDate()]);
    
    if (rangeRightMoment.diff(rangeLeftMoment, 'months') <= 6) {
        return '%d %b';
    } else if (rangeRightMoment.diff(rangeLeftMoment, 'years') <= 3) {
        return '%b %Y';
    } else {
        return '%Y';
    }
};

export const rangeToStep = (range: Range, isMobile: boolean): Step => {
    const rangeLeftMoment = moment([
        range.rangeLeft.getFullYear(), 
        range.rangeLeft.getMonth(), 
        range.rangeLeft.getDate()]);
    const rangeRightMoment = moment([
        range.rangeRight.getFullYear(), 
        range.rangeRight.getMonth(), 
        range.rangeRight.getDate()]);

    const multiplier = isMobile ? 2 : 1;
    if (rangeRightMoment.diff(rangeLeftMoment, 'months') <= 1) {
        return {
            interval: d3.timeDay,
            every: (rangeRightMoment.diff(rangeLeftMoment, 'weeks') + 2) * multiplier || 1 * multiplier
        }
    } else if (rangeRightMoment.diff(rangeLeftMoment, 'months') <= 6) {
        return {
            interval: d3.timeWeek,
            every: rangeRightMoment.diff(rangeLeftMoment, 'months') * multiplier || 1 * multiplier
        }
    } else if (rangeRightMoment.diff(rangeLeftMoment, 'years') <= 3) {
        return {
            interval: d3.timeMonth,
            every: rangeRightMoment.diff(rangeLeftMoment, 'years') * 2 * multiplier || 1 * multiplier
        }
    } else {
        return {
            interval: d3.timeYear,
            every: 1 * multiplier
        }
    }
};