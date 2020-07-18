import { Range, PlotProps, DataPoint } from "../Interfaces";
// import simplify from 'simplify-js';

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
    const amountOfDataPoints = data.data.filter((dataPoint) => {
        return dataPoint.date >= range.rangeLeft && dataPoint.date <= range.rangeRight;
    }).length;

    return data.data.filter(() => {
        if (amountOfDataPoints >= 150) {
            const probability = 150 / amountOfDataPoints;
            return Math.random() < probability;
        }
        return true;
    });
    // console.log(data.data.length);
    // if (monthDiff(range.rangeLeft, range.rangeRight) >= 6) {
        // const dataDuplicate: Array<{date: number, value: number}> = [];
        // for (let i = 0; i < data.data.length; i++) {
        //     dataDuplicate.push({ date: data.data[i].date.getTime(), value: data.data[i].value });
        // }
        // const result = simplify(dataDuplicate, average(dataDuplicate), true);
        // // console.log(result.length);
        // const _result = [];
        // for (let i = 0; i < result.length; i++) {
        //     _result.push({date: new Date(result[i].date), value: result[i].value});
        // }
        // console.log(_result);
        // return _result;
    // }
    // return data.data;
}