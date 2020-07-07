import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Range, DataPoint, PlotProps } from '../Interfaces';
import { mousemove, mouseover, mouseout } from '../Utilities/Cursor';
import { body, cursor } from '../Utilities/Styles';

const ChartComponent: React.FunctionComponent<
    { range: Range, dateFormat: string, data: PlotProps }
    > = ({ range, dateFormat, data }) => {

    const mainSvgRef = useRef((null as unknown) as SVGSVGElement);
    const chartBodyRef = useRef((null as unknown) as SVGGElement);
    const xAxisRef = useRef((null as unknown) as SVGGElement);
    const yAxisRef = useRef((null as unknown) as SVGGElement);
    const areaPathRef = useRef((null as unknown) as SVGPathElement);
    const linePathRef = useRef((null as unknown) as SVGPathElement);
    const focusLineRef = useRef((null as unknown) as SVGLineElement);
    const focusCircleRef = useRef((null as unknown) as SVGCircleElement);
    const focusTextRef = useRef((null as unknown) as SVGTextElement);
    const pointerSpaceRef = useRef((null as unknown) as SVGRectElement);

    useEffect(() => {
        d3.select(mainSvgRef.current)
            .attr('width', body.width + body.margin.right + body.margin.left)
            .attr('height', body.height + body.margin.top + body.margin.bottom);
        d3.select(chartBodyRef.current)
            .attr('transform', `translate(${body.margin.left}, ${body.margin.top})`);

        const xAxisGenerator: d3.ScaleTime<number, number> = d3.scaleTime()
            .domain([range.rangeLeft, range.rangeRight])
            .range([0, body.width]);
        d3.select(xAxisRef.current)
            .style('font', '13px sans-serif')
            .attr('transform', `translate(0, ${body.height})`)
            .transition()
            .duration(3000)
            .call(d3.axisBottom(xAxisGenerator)
                .tickSize(0)
                .tickFormat(
                    d3.timeFormat(dateFormat) as () => string)
                    .tickValues(data.data.map((d) => d.date))
                .tickPadding(20))
            .select('.domain')
                .attr('opacity', '0');
        
        const yAxisGenerator: d3.ScaleLinear<number, number> = d3.scaleLinear()
            // Take min/max into separate util
            .domain([
                d3.min(data.data, (d) => {
                    if (d.date >= range.rangeLeft && d.date <= range.rangeRight)
                    return d.value;
                }) as number, 
                d3.max(data.data, (d) => {
                    if (d.date >= range.rangeLeft && d.date <= range.rangeRight)
                    return d.value;
                }) as number])
            .range([body.height, 0]);
        d3.select(yAxisRef.current)
            .style('font', '13px sans-serif')
            .transition()
            .duration(3000)
            .call(d3.axisLeft(yAxisGenerator)
                .tickSize(0)
                .tickPadding(30))
            .select('.domain')
                .attr('opacity', '0');
        
        d3.select(areaPathRef.current)
            .datum(data.data)
            .attr('fill', '#edfaea')
            .transition('width')
            .duration(3000)
            .attr('d', d3.area<DataPoint>()
                .defined(d => d.date >= range.rangeLeft && d.date <= range.rangeRight)
                .x((d) => xAxisGenerator(d.date))
                .y0(yAxisGenerator(d3.min(data.data, (d) => {
                    if (d.date >= range.rangeLeft && d.date <= range.rangeRight) {
                        return d.value;
                    }
                }) as number))
                .y1((d) => yAxisGenerator(d.value))
            );
        
        d3.select(linePathRef.current)
            .datum(data.data)
            .attr('stroke', '#6ad370')
            .attr('stroke-width', 4)
            .attr('fill', 'none')
            .transition()
            .duration(3000)
            .attr('d', d3.line<DataPoint>()
                .defined(d => d.date >= range.rangeLeft && d.date <= range.rangeRight)
                .x(d => xAxisGenerator(d.date))
                .y(d => yAxisGenerator(d.value))
            );

        const focusLine = d3.select(focusLineRef.current)
                .attr('stroke-dasharray', cursor.strokeDashArray)
                .style('stroke', 'black');

        const focusCircle = d3.select(focusCircleRef.current)
                .attr('stroke', cursor.color)
                .attr('r', cursor.radius)
                .style('fill', cursor.color)
                .style('opacity', 0);
        

        const focusText = d3.select(focusTextRef.current)
                .attr('text-anchor', cursor.text.anchor)
                .style('font', cursor.text.font)
                .style('font-weight', cursor.text.weight)
                .style('opacity', 0);

        d3.select(pointerSpaceRef.current)
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

    }, [range]);

    return (
        <div>
            <svg ref={mainSvgRef}>
                <g ref={chartBodyRef}>
                    <g ref={xAxisRef} />
                    <g ref={yAxisRef} />
                    <path ref={areaPathRef} />
                    <path ref={linePathRef} />
                    <g>
                        <line ref={focusLineRef} />
                        <circle ref={focusCircleRef} />
                        <text ref={focusTextRef} />
                    </g>
                    <rect ref={pointerSpaceRef} />
                </g>
            </svg>
        </div>
    );
};

export default ChartComponent;