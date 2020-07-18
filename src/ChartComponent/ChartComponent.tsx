import './ChartComponent.scss';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Range, DataPoint, PlotProps, Step } from '../Shared/Interfaces';
import { mousemove, mouseover, mouseout } from './Utilities/cursor';
import { body } from './Utilities/constants';
import { maxForRange, minForRange } from './Utilities/maxMin';
import { filterData } from '../Shared/Utilities';
import PropTypes from 'prop-types';
import { useResizeObserver } from './Utilities/resizeObserver';

const ChartComponent: React.FunctionComponent<
    { range: Range, dateFormat: string, data: PlotProps, step: Step }
    > = ({ range, dateFormat, data, step }) => {

    const _data = filterData(range, data);
    console.log(range);
    const wrapRef = useRef<HTMLDivElement>(null);
    const mainSvgRef = useRef<SVGSVGElement>(null);
    const chartBodyRef = useRef<SVGGElement>(null);
    const xAxisRef = useRef<SVGGElement>(null);
    const yAxisRef = useRef<SVGGElement>(null);
    const areaPathRef = useRef<SVGPathElement>(null);
    const linePathRef = useRef<SVGPathElement>(null);
    const focusLineRef = useRef<SVGLineElement>(null);
    const focusCircleRef = useRef<SVGCircleElement>(null);
    const focusTextRef = useRef<SVGTextElement>(null);
    const pointerSpaceRef = useRef<SVGRectElement>(null);

    const dimensions = useResizeObserver(wrapRef);

    useEffect(() => {
        if (!dimensions) return;
        const xAxisGenerator: d3.ScaleTime<number, number> = d3.scaleTime()
            .domain([range.rangeLeft, range.rangeRight])
            .range([0, dimensions.width - body.margin.left - body.margin.right]);
        xAxisRef.current && d3.select(xAxisRef.current)
            .attr('transform', `translate(0, ${dimensions.height - body.margin.bottom - body.margin.top})`)
            .call(d3.axisBottom(xAxisGenerator)
                .tickSize(0)
                .tickFormat(d3.timeFormat(dateFormat) as () => string)
                .ticks(step.interval, step.every)
                .tickPadding(20))
            .select('.domain')
                .attr('opacity', '0');
    
        const yAxisGenerator: d3.ScaleLinear<number, number> = d3.scaleLinear()
            .domain([minForRange(_data, range), maxForRange(_data, range) + 10])
            .range([dimensions.height - body.margin.top - body.margin.bottom, 0])
            .nice();
        yAxisRef.current && d3.select(yAxisRef.current)
            .call(d3.axisLeft(yAxisGenerator)
                .tickSize(0)
                .tickPadding(30))
            .select('.domain')
                .attr('opacity', '0');
        
        d3.select(areaPathRef.current)
            .datum(_data)
            .attr('d', d3.area<DataPoint>()
                .defined((d) => d.date <= range.rangeRight && d.date >= range.rangeLeft)
                .x((d) => xAxisGenerator(d.date))
                .y0(yAxisGenerator(minForRange(_data, range)))
                .y1((d) => yAxisGenerator(d.value))
            );
        
        
        d3.select(linePathRef.current)
            .datum(_data)
            .attr('d', d3.line<DataPoint>()
                .defined((d) => d.date <= range.rangeRight && d.date >= range.rangeLeft)
                .x(d => xAxisGenerator(d.date))
                .y(d => yAxisGenerator(d.value))
            );

        const focusLine = d3.select(focusLineRef.current);

        const focusCircle = d3.select(focusCircleRef.current)

        const focusText = d3.select(focusTextRef.current);

        d3.select(pointerSpaceRef.current)
            .on('mouseover', () => {
                mouseover(focusCircle, focusText, focusLine);
            })
            .on('mousemove', () => {
                mousemove(xAxisGenerator, yAxisGenerator, _data, focusCircle, focusText, focusLine, range, dimensions);
            })
            .on('mouseout', () => {
                mouseout(focusCircle, focusText, focusLine);
            });

    }, [range, dimensions, _data, dateFormat, step]);

    return (
        <div ref={wrapRef}>
        <svg ref={mainSvgRef} styleName='container'>
            <g ref={chartBodyRef} styleName='chart-body'>
                <g ref={xAxisRef} styleName='x-axis' />
                <g ref={yAxisRef} styleName='y-axis' />
                <path ref={areaPathRef} styleName='area-path' />
                <path ref={linePathRef} styleName='line-path' />
                <g>
                    <line ref={focusLineRef} styleName='focus-line' />
                    <circle ref={focusCircleRef} styleName='focus-circle' />
                    <text ref={focusTextRef} styleName='focus-text' />
                </g>
                <rect ref={pointerSpaceRef} styleName='pointer-space' />
            </g>
        </svg>
        </div>
    );
};

ChartComponent.propTypes = {
    range: PropTypes.any.isRequired,
    dateFormat: PropTypes.string.isRequired,
    data: PropTypes.any.isRequired,
    step: PropTypes.any.isRequired
}

export default ChartComponent;