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
    return '%d.%m';
  } else if (rangeRightMoment.diff(rangeLeftMoment, 'years') <= 3) {
    return '%b %Y';
  } else {
    return '%Y';
  }
};

export const rangeToStep = (range: Range): Step => {
  const rangeLeftMoment = moment([
    range.rangeLeft.getFullYear(),
    range.rangeLeft.getMonth(),
    range.rangeLeft.getDate()]);
  const rangeRightMoment = moment([
    range.rangeRight.getFullYear(),
    range.rangeRight.getMonth(),
    range.rangeRight.getDate()]);

  if (rangeRightMoment.diff(rangeLeftMoment, 'months') <= 1) {
    return {
      interval: d3.timeDay,
      every: (rangeRightMoment.diff(rangeLeftMoment, 'weeks') + 1) || 1
    }
  } else if (rangeRightMoment.diff(rangeLeftMoment, 'months') <= 6) {
    return {
      interval: d3.timeWeek,
      every: rangeRightMoment.diff(rangeLeftMoment, 'months') || 1
    }
  } else if (rangeRightMoment.diff(rangeLeftMoment, 'years') <= 3) {
    return {
      interval: d3.timeMonth,
      every: rangeRightMoment.diff(rangeLeftMoment, 'years') || 1
    }
  } else if (rangeRightMoment.diff(rangeLeftMoment, 'years') <= 9) {
    return {
      interval: d3.timeYear,
      every: 1
    }
  }
  else {
    return {
      interval: d3.timeYear,
      every: 2
    }
  }
};