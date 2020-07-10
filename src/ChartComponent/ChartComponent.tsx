import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Range, DataPoint, PlotProps } from '../Interfaces';
import { mousemove, mouseover, mouseout } from '../Utilities/Cursor';
import { body, cursor } from '../Utilities/Styles';
import { maxForRange, minForRange } from '../Utilities/MaxMin';
import { filterData } from '../Utilities/Services';

const ChartComponent: React.FunctionComponent<
    { range: Range, dateFormat: string, data: PlotProps }
    > = ({ range, dateFormat, data }) => {

    const _data = filterData(range, data);
    
    const mainSvgRef = useRef((null as unknown) as SVGSVGElement);
    const clipPathRef = useRef((null as unknown) as SVGClipPathElement);
    const clipPathRectRef = useRef((null as unknown) as SVGRectElement);
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
            .attr('height', body.height + body.margin.top + body.margin.bottom)
        d3.select(chartBodyRef.current)
            .attr('transform', `translate(${body.margin.left}, ${body.margin.top})`);

        d3.select(clipPathRef.current)
            .attr('id', 'clip')   
        d3.select(clipPathRectRef.current)
            .attr('width', body.width + body.margin.right + body.margin.left)
            .attr('height', body.height + body.margin.top + body.margin.bottom);

        const xAxisGenerator: d3.ScaleTime<number, number> = d3.scaleTime()
            .domain([range.rangeLeft, range.rangeRight])
            .range([0, body.width]);
        d3.select(xAxisRef.current)
            .style('font', '13px sans-serif')
            .attr('transform', `translate(0, ${body.height})`)
            .transition()
            .duration(1000)
            .style('opacity', 1)
            .call(d3.axisBottom(xAxisGenerator)
                .tickSize(0)
                .tickFormat(d3.timeFormat(dateFormat) as () => string)
                    // .tickValues(
                    //     data.data
                    //         .map((d) => d.date)
                    //         .filter((date) => date >= range.rangeLeft && date <= range.rangeRight))
                .ticks(d3.timeMonth, 1)
                .tickPadding(20))
            .select('.domain')
                .attr('opacity', '0');
        
        const yAxisGenerator: d3.ScaleLinear<number, number> = d3.scaleLinear()
            .domain([minForRange(_data, range), maxForRange(_data, range) + 10])
            .range([body.height, 0]);
        d3.select(yAxisRef.current)
            .style('font', '13px sans-serif')
            .transition()
            .duration(1000)
            .call(d3.axisLeft(yAxisGenerator)
                .tickSize(0)
                .tickPadding(30))
            .select('.domain')
                .attr('opacity', '0');
        
        d3.select(areaPathRef.current)
            .datum(_data)
            .attr('clip-path', 'url(#clip)')
            .attr('fill', '#edfaea')
            .transition()
            .duration(1000)
            .attr('d', d3.area<DataPoint>()
                .x((d) => xAxisGenerator(d.date))
                .y0(yAxisGenerator(minForRange(_data, range)))
                .y1((d) => yAxisGenerator(d.value))
            );
        
        
        d3.select(linePathRef.current)
            .datum(_data)
            .attr('clip-path', 'url(#clip)')
            .attr('stroke', '#6ad370')
            .attr('stroke-width', 1.5)
            .attr('fill', 'none')
            .transition()
            .duration(1000)
            .attr('d', d3.line<DataPoint>()
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
                mouseover(focusCircle, focusText, focusLine);
            })
            .on('mousemove', () => {
                mousemove(xAxisGenerator, yAxisGenerator, _data, focusCircle, focusText, focusLine);
            })
            .on('mouseout', () => {
                mouseout(focusCircle, focusText, focusLine);
            });

    }, [range]);

    return (
        <div>
            <svg ref={mainSvgRef}>
                <defs>
                    <clipPath ref={clipPathRef}>
                        <rect ref={clipPathRectRef}></rect>
                    </clipPath>
                </defs>
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