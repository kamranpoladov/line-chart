import { PlotProps, Range } from "../../Interfaces";
import { max, min } from 'd3';

export const maxForRange = (data: PlotProps, range: Range): number => {
    return max(data.data, (d) => {
        if (d.date >= range.rangeLeft && d.date <= range.rangeRight) {
            return d.value;
        }
    }) as number;
};

export const minForRange = (data: PlotProps, range: Range): number => {
    return min(data.data, (d) => {
        if (d.date >= range.rangeLeft && d.date <= range.rangeRight) {
            return d.value;
        }
    }) as number;
}