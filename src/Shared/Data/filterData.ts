import { Range, PlotProps, DataPoint } from "../Interfaces";
// import simplify from 'simplify-js';

export const filterData = (range: Range, data: PlotProps): DataPoint[] => {
    const amountOfDataPoints = data.data.filter((dataPoint) => {
        return dataPoint.date >= range.rangeLeft && dataPoint.date <= range.rangeRight;
    }).length;

    if (amountOfDataPoints >= 100) {
        return data.data.filter((_, i) => {
            const skip = Math.round(amountOfDataPoints / 100);
            return i % skip == 0;
        });
    }
    return data.data;
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