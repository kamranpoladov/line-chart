import { Range, DataPoint } from "../../Shared/Interfaces";
import { max, min } from 'd3';

export const maxForRange = (data: DataPoint[], range: Range): number => {
    return max(data, (d) => {
        if (d.date >= range.rangeLeft && d.date <= range.rangeRight) {
            return d.value;
        }
    }) as number;
};

export const minForRange = (data: DataPoint[], range: Range): number => {
    return min(data, (d) => {
        if (d.date >= range.rangeLeft && d.date <= range.rangeRight) {
            return d.value;
        }
    }) as number;
}