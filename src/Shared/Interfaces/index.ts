export interface Range {
  rangeLeft: Date,
  rangeRight: Date
};

export interface PlotProps {
  data: Array<DataPoint>,
  defaultRange: Range
};

export interface DataPoint {
  date: Date,
  value: number
};

export interface Step {
  interval: d3.CountableTimeInterval,
  every: number
}