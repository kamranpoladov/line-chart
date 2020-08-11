import * as d3 from 'd3';
import { DataPoint, Range } from '../Interfaces';
import { body } from './constants';
import { ContentRect } from 'resize-observer/lib/ContentRect';

const bisect = d3.bisector<DataPoint, Date>((d) => d.date).left;

const getClosestValue = (
  data: DataPoint[], 
  mousePos: number, 
  dataPointIndex: number,
  xAxisGenerator: d3.ScaleTime<number, number>): number => {
  const current = Math.abs(mousePos - xAxisGenerator(data[dataPointIndex].date));
  const toTheLeft = Math.abs(mousePos - xAxisGenerator(data[dataPointIndex - 1].date));
  const min = Math.min(current, toTheLeft);
  if (min == current) {
    return dataPointIndex;
  } else {
    return dataPointIndex - 1;
  }
}

export const mouseover = (
  focusCircle: d3.Selection<SVGCircleElement | null, unknown, null, any>,
  focusTextBox: d3.Selection<HTMLDivElement | null, unknown, null, undefined>,
  focusTextValue: d3.Selection<HTMLSpanElement | null, unknown, null, undefined>,
  focusTextDate: d3.Selection<HTMLSpanElement | null, unknown, null, undefined>,
  focusLine: d3.Selection<SVGLineElement | null, unknown, null, any>
) => {
  focusCircle.style('opacity', 1);
  focusTextBox.style('opacity', 1);
  focusTextValue.style('opacity', 1);
  focusTextDate.style('opacity', 1);
  focusLine.style('opacity', 1);
};

export const mousemove = (
  xAxisGenerator: d3.ScaleTime<number, number>,
  yAxisGenerator: d3.ScaleLinear<number, number>,
  data: DataPoint[],
  focusCircle: d3.Selection<SVGCircleElement | null, unknown, null, any>,
  focusTextBox: d3.Selection<HTMLDivElement | null, unknown, null, undefined>,
  focusTextValue: d3.Selection<HTMLSpanElement | null, unknown, null, undefined>,
  focusTextDate: d3.Selection<HTMLSpanElement | null, unknown, null, undefined>,
  focusLine: d3.Selection<SVGLineElement | null, unknown, null, any>,
  range: Range,
  dimensions: ContentRect,
  marginLeft: number
  // xAxis: SVGGElement | null,
  // yAxis: SVGGElement |null
) => {
  const x0 = xAxisGenerator.invert(d3.mouse(d3.event.currentTarget)[0]);
  const rawIndex = bisect(data, x0);
  const indexProcessed = getClosestValue(data, d3.mouse(d3.event.currentTarget)[0], rawIndex, xAxisGenerator);
  const selectedData = data[indexProcessed];
  if (selectedData && selectedData.date <= range.rangeRight && selectedData.date >= range.rangeLeft) {

    const formatValue = d3.format('');
    const formatDate = d3.timeFormat('%a, %-d %b');
    const valueText = formatValue(selectedData.value);
    const dateText = formatDate(selectedData.date);

    focusCircle
      .attr('cx', xAxisGenerator(selectedData.date))
      .attr('cy', yAxisGenerator(selectedData.value));
    focusTextValue
      .text(`${valueText} `);
    focusTextDate
      .text(`${dateText}`);
    
    let leftOffset = 0;
    if (xAxisGenerator(selectedData.date) > dimensions.width - (focusTextBox.node()?.getBoundingClientRect().width || 0)) {
      leftOffset = dimensions.width - (focusTextBox.node()?.getBoundingClientRect().width || 0);
    } else if (xAxisGenerator(selectedData.date) < marginLeft) {
      leftOffset = marginLeft;
    } else {
      leftOffset = xAxisGenerator(selectedData.date);
    }

    focusTextBox
      .style('opacity', 1)
      .style('left', `${leftOffset}px`)
      .style('top', `${yAxisGenerator(selectedData.value)}px`)
    focusLine
      .attr('x1', xAxisGenerator(selectedData.date))
      .attr('x2', xAxisGenerator(selectedData.date))
      .attr('y1', yAxisGenerator(selectedData.value))
      .attr('y2', dimensions.height - body.margin.bottom - body.margin.top);

    // const xTicks = d3.select(xAxis).selectAll('.tick').attr('color', '#BABABA');
    // const yTicks = d3.select(yAxis).selectAll('.tick');
    // d3.select(xAxis).selectAll('.tick')
    // .each((d, i) => {
    // if (d instanceof Date && d.getTime() == selectedData.date.getTime()) {
    // d3.select(xTicks._groups[0][i]).attr('color', 'black')
    // }
    // });
  }
};

export const mouseout = (
  focusCircle: d3.Selection<SVGCircleElement | null, unknown, null, any>,
  focusTextBox: d3.Selection<HTMLDivElement | null, unknown, null, undefined>,
  focusTextValue: d3.Selection<HTMLSpanElement | null, unknown, null, undefined>,
  focusTextDate: d3.Selection<HTMLSpanElement | null, unknown, null, undefined>,
  focusLine: d3.Selection<SVGLineElement | null, unknown, null, any>
) => {
  focusCircle.style('opacity', 0);
  focusTextBox.style('opacity', 0);
  focusTextValue.style('opacity', 0);
  focusTextDate.style('opacity', 0);
  focusLine.style('opacity', 0);
  // d3.selectAll('.tick').attr('color', '#BABABA');
};