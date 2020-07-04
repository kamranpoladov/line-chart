export interface Range {
	rangeLeft: Date,
	rangeRight: Date
};

export interface PlotProps {
    data: Array<{date: Date, value: number}>;
};