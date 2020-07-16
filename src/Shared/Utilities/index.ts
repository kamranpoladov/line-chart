import { Range, PlotProps, DataPoint } from "../Interfaces";

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

// To be improved
export const filterData = (range: Range, data: PlotProps): DataPoint[] => {
    const amountOfDataPoints = data.data.filter((dataPoint) => {
        return dataPoint.date >= range.rangeLeft && dataPoint.date <= range.rangeRight;
    }).length;

    return data.data.filter((_, i) => {
        if (amountOfDataPoints >= 150) {
            const probability = amountOfDataPoints / (amountOfDataPoints - 150);
            return i % Math.round(probability) != 0;
        } else {
            return true;
        }
    })
};