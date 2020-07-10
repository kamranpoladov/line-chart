import { Range, PlotProps, DataPoint } from "../../Interfaces";

export const monthDiff = (startDate: Date, endDate: Date): number => {
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    return months <= 0 ? 0 : months;
};

export const filterData = (range: Range, data: PlotProps): DataPoint[] => {
    return data.data.filter((dataPoint) => {
        const diff = monthDiff(range.rangeLeft, range.rangeRight);
        if (diff >= 6) {
            return dataPoint.date.getDate() % Math.floor(diff / 3) == 0;
        } else {
            return true;
        }
    })
}