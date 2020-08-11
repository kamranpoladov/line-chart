export interface Range {
  rangeLeft: Date;
  rangeRight: Date;
};

// Possibly use that for PlotProps in future
type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
        [K in Keys]-?:
            Required<Pick<T, K>>
            & Partial<Record<Exclude<Keys, K>, undefined>>
    }[Keys];

export interface PlotProps {
  data: Array<DataPoint>;
  range: Range;
  height?: number;
  heightPercentage?: number;
};

export interface DataPoint {
  date: Date,
  value: number
};

export interface Step {
  intervalFunction: d3.TimeInterval
}