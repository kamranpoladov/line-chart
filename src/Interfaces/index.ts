export interface Range {
	rangeLeft: Date,
	rangeRight: Date
};

export interface PlotProps {
    data: Array<DataPoint>;
};

export interface DataPoint {
	date: Date,
	value: number
};