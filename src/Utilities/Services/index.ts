import { Range, PlotProps, DataPoint } from "../../Interfaces";

export const weekDiff = (startDate: Date, endDate: Date): number => {
    return Math.floor((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000) + 1);
};

export const monthDiff = (startDate: Date, endDate: Date): number => {
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    return months <= 0 ? 1 : months;
};

export const yearDiff = (startDate: Date, endDate: Date): number => {
    return +((endDate.getTime() - startDate.getTime()) / 31536000000).toFixed(0);
}

export const filterData = (range: Range, data: PlotProps): DataPoint[] => {
    return data.data.filter((dataPoint) => {
        const diff = monthDiff(range.rangeLeft, range.rangeRight);
        if (diff >= 6) {
            return dataPoint.date.getDate() % Math.floor(diff / 3) == 0;
        } else {
            return true;
        }
    })
};

export const timeStamps = {
    day: 864 * Math.pow(10, 5),
    week: 6 * Math.pow(10, 8),
    month: 2628 * Math.pow(10, 6),
    year: 3154 * Math.pow(10, 7)
}