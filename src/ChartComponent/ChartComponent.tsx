import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { Range } from '../Interfaces';
import data from '../Data';
import { curveBasis } from 'd3';

const ChartComponent: React.FunctionComponent<{ range: Range, dateFormat: string }> = ({ range, dateFormat }) => {
    useEffect(() => {
        const svg: d3.Selection<SVGGElement, unknown, HTMLElement, any> = d3.select('#line-chart')
        // TODO: take attributes to .scss file
            .append('svg')
                .attr('width', 460)
                .attr('height', 400)
            .append('g')
                .attr('transform', 'translate(60, 10)');
        const xAxis: d3.ScaleTime<number, number> = d3.scaleTime()
            .domain([range.rangeLeft, range.rangeRight])
            .range([0, 370]);
        svg.append('g')
            .attr('transform', 'translate(0, 360)')
            .call(d3.axisBottom(xAxis)
            .tickFormat(d3.timeFormat(dateFormat)).tickValues(data.data.map((d) => d.date)));
        
        const yAxis: d3.ScaleLinear<number, number> = d3.scaleLinear()
            .domain([0, d3.max(data.data, (d) => +d.value)])
            .range([360, 0]);
        svg.append('g')
            .call(d3.axisLeft(yAxis));

        svg.append('path')
            .datum(data.data)
            .attr('fill', '#cce5df')
            .attr('stroke', '#69b3a2')
            .attr('stroke-width', 1.5)
            .attr('d', d3.area<any>()
                .curve(curveBasis)
                .x((d) => xAxis(d.date))
                .y0(yAxis(0))
                .y1((d) => yAxis(d.value))
        );

    }, []);

    return (
        <div id='line-chart' />
    );
};

export default ChartComponent;