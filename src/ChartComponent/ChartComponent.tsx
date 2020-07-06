import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { Range, DataPoint, PlotProps } from '../Interfaces';
import { mousemove, mouseover, mouseout } from '../Utilities/Cursor';
import { body, cursor } from '../Utilities/Styles';

const ChartComponent: React.FunctionComponent<
    { range: Range, dateFormat: string, data: PlotProps }
    > = ({ range, dateFormat, data }) => {

    useEffect(() => {
        const svg: d3.Selection<SVGGElement, unknown, HTMLElement, any> = d3.select('#line-chart')
            .append('svg')
                .attr('width', body.width + body.margin.right + body.margin.left)
                .attr('height', body.height + body.margin.top + body.margin.bottom)
            .append('g')
                .attr('transform', `translate(${body.margin.left}, ${body.margin.top})`);
        const xAxisGenerator: d3.ScaleTime<number, number> = d3.scaleTime()
            .domain([range.rangeLeft, range.rangeRight])
            .range([0, body.width]);
        svg.append('g')
            .style('font', '13px sans-serif')
            .attr('transform', `translate(0, ${body.height})`)
            .call(d3.axisBottom(xAxisGenerator)
                .tickSize(0)
                .tickFormat(
                    d3.timeFormat(dateFormat) as () => string)
                    .tickValues(data.data.map((d) => d.date))
                .tickPadding(20))
            .select('.domain')
                .attr('opacity', '0');
        
        const yAxisGenerator: d3.ScaleLinear<number, number> = d3.scaleLinear()
            .domain([d3.min(data.data, d => d.value) as number, d3.max(data.data, d => d.value) as number])
            .range([body.height, 0]);
        svg.append('g')
            .style('font', '13px sans-serif')
            .call(d3.axisLeft(yAxisGenerator)
                .tickSize(0)
                .tickPadding(30))
            .select('.domain')
                .attr('opacity', '0');
        
        svg.append('path')
            .datum(data.data)
            .attr('fill', '#edfaea')
            .attr('d', d3.area<DataPoint>()
                .defined(d => d.date >= range.rangeLeft && d.date <= range.rangeRight)
                .x((d) => xAxisGenerator(d.date))
                .y0(yAxisGenerator(d3.min(data.data, d => d.value) as number))
                .y1((d) => yAxisGenerator(d.value))
            );
        
        svg.append('path')
            .datum(data.data)
            .attr('stroke', '#6ad370')
            .attr('stroke-width', 4)
            .attr('fill', 'none')
            .attr('d', d3.line<DataPoint>()
                .defined(d => d.date >= range.rangeLeft && d.date <= range.rangeRight)
                .x(d => xAxisGenerator(d.date))
                .y(d => yAxisGenerator(d.value))
            );


        const focus = svg.append('g');

        const focusLine = focus.append('line')
                .attr('stroke-dasharray', cursor.strokeDashArray)
                .style('stroke', 'black');

        const focusCircle = focus.append('circle')
                .attr('stroke', cursor.color)
                .attr('r', cursor.radius)
                .style('fill', cursor.color)
                .style('opacity', 0);
        

        const focusText = focus.append('text')
                .attr('text-anchor', cursor.text.anchor)
                .style('font', cursor.text.font)
                .style('font-weight', cursor.text.weight)
                .style('opacity', 0);

        svg.append('rect')
            .style('fill', 'none')
            .attr('pointer-events', 'all')
            .attr('width', body.width + body.margin.right + body.margin.left)
            .attr('height', body.height + body.margin.top + body.margin.bottom)
            .attr('x', -body.margin.right)
            .attr('y', -body.margin.top)
            .on('mouseover', () => {
                mouseover(focusCircle, focusText, focusLine)
            })
            .on('mousemove', () => {
                mousemove(xAxisGenerator, yAxisGenerator, data, focusCircle, focusText, focusLine);
            })
            .on('mouseout', () => {
                mouseout(focusCircle, focusText, focusLine);
            });

    }, []);

    return (
        <div id='line-chart'/>
    );
};

export default ChartComponent;