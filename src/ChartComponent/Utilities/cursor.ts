import * as d3 from 'd3';
import { DataPoint, Range } from '../../Shared/Interfaces';
import { body } from './constants';
import { ContentRect } from 'resize-observer/lib/ContentRect';

const bisect = d3.bisector<DataPoint, Date>((d) => d.date).right;

export const mouseover = (
        focusCircle: d3.Selection<SVGCircleElement | null, unknown, null, any>,
        focusText: d3.Selection<SVGTextElement | null, unknown, null, undefined>,
        focusLine: d3.Selection<SVGLineElement | null, unknown, null, any>
) => {
    focusCircle.style('opacity', 1);
    focusText.style('opacity', 1);
    focusLine.style('opacity', 1);
};

export const mousemove = (
        xAxisGenerator: d3.ScaleTime<number, number>,
        yAxisGenerator: d3.ScaleLinear<number, number>,
        data: DataPoint[],
        focusCircle: d3.Selection<SVGCircleElement | null, unknown, null, any>,
        focusText: d3.Selection<SVGTextElement | null, unknown, null, undefined>,
        focusLine: d3.Selection<SVGLineElement | null, unknown, null, any>,
        range: Range,
        dimensions: ContentRect
) => {
    const x0 = xAxisGenerator.invert(d3.mouse(d3.event.currentTarget)[0]);
    const i = bisect(data, x0, 1) - 1;
    const selectedData = data[i];
    if (selectedData && selectedData.date <= range.rangeRight && selectedData.date >= range.rangeLeft) {
        focusCircle
            .attr('cx', xAxisGenerator(selectedData.date))
            .attr('cy', yAxisGenerator(selectedData.value));
        focusText
            .html(`${selectedData.value}`)
            .attr('x', xAxisGenerator(selectedData.date))
            .attr('y', yAxisGenerator(selectedData.value) - 30);
        focusLine
            .attr('x1', xAxisGenerator(selectedData.date))
            .attr('x2', xAxisGenerator(selectedData.date))
            .attr('y1', yAxisGenerator(selectedData.value) - 24)
            .attr('y2', dimensions.height - body.margin.bottom - body.margin.top);
    }
};

export const mouseout = (
    focusCircle: d3.Selection<SVGCircleElement | null, unknown, null, any>,
    focusText: d3.Selection<SVGTextElement | null, unknown, null, undefined>,
    focusLine: d3.Selection<SVGLineElement | null, unknown, null, any>
) => {
    focusCircle.style('opacity', 0);
    focusText.style('opacity', 0);
    focusLine.style('opacity', 0);
};