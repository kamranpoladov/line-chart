import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { Range, DataPoint, PlotProps } from '../Interfaces';
import data from '../Data';
import { curveBasis } from 'd3';

const ChartComponent: React.FunctionComponent<{ range: Range, dateFormat: string }> = ({ range, dateFormat }) => {
    const dimensions = {
        width: 800,
        height: 400
    };

    const margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 100 
    }

    useEffect(() => {
        const svg: d3.Selection<SVGGElement, unknown, HTMLElement, any> = d3.select('#line-chart')
            .append('svg')
                .attr('width', dimensions.width + margin.right + margin.left)
                .attr('height', dimensions.height + margin.top + margin.bottom)
            .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);
        const xAxisGenerator: d3.ScaleTime<number, number> = d3.scaleTime()
            .domain([range.rangeLeft, range.rangeRight])
            .range([0, dimensions.width]);
        svg.append('g')
            .style('font', '13px sans-serif')
            .attr('transform', `translate(0, ${dimensions.height})`)
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
            .range([dimensions.height, 0]);
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
                // .curve(curveBasis)
                .defined(d => d.date >= range.rangeLeft && d.date <= range.rangeRight)
                .x((d) => xAxisGenerator(d.date))
                .y0(yAxisGenerator(d3.min(data.data, d => d.value) as number))
                .y1((d) => yAxisGenerator(d.value))
            );
        
        svg.append('path')
            .datum(data.data)
            .attr('stroke', '#6ad370')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('d', d3.line<DataPoint>()
                // .curve(curveBasis)
                .defined(d => d.date >= range.rangeLeft && d.date <= range.rangeRight)
                .x(d => xAxisGenerator(d.date))
                .y(d => yAxisGenerator(d.value))
            );

        // TODO: take pointer follower functionality into separate service file
        const bisect = d3.bisector<DataPoint, Date>((d) => d.date).left;

        const focus = svg.append('g')
            .append('circle')
            .style('fill', '#6ad370')
            .attr('stroke', '#6ad370')
            .attr('r', 3)
            .style('opacity', 0);
        

        const focusText = svg.append('g')
            .append('text')
            .style("opacity", 0)
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle");
            
        const mouseover = () => {
            focus.style('opacity', 1);
            focusText.style('opacity', 1);
        };

        const mousemove = () => {
            const x0 = xAxisGenerator.invert(d3.mouse(d3.event.currentTarget)[0]);
            const i = bisect(data.data, x0, 1);
            const selectedData = data.data[i];
            focus
              .attr("cx", xAxisGenerator(selectedData.date))
              .attr("cy", yAxisGenerator(selectedData.value))
            focusText
              .html(`${selectedData.value}`)
              .attr('x', xAxisGenerator(selectedData.date) + 15)
              .attr('y', yAxisGenerator(selectedData.value))
        }

        const mouseout = () => {
            focus.style('opacity', 0);
            focusText.style('opacity', 0);
        }

        svg.append('rect')
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .attr('width', dimensions.width + margin.right + margin.left)
            .attr('height', dimensions.height + margin.top + margin.bottom)
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseout', mouseout);

    }, []);

    return (
        <div id='line-chart' />
    );
};

export default ChartComponent;