import './ChartComponent.scss';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Range, DataPoint, PlotProps, Step } from '../Shared/Interfaces';
import { mousemove, mouseover, mouseout } from './Utilities/cursor';
import { body, mobileWidth } from './Utilities/constants';
import { maxForRange, minForRange } from './Utilities/maxMin';
import { filterData } from '../Shared/Data/filterData';
import PropTypes from 'prop-types';
import { useResizeObserver } from './Utilities/resizeObserver';
import { rangeToFormat, rangeToStep } from './Utilities/formatDate';
import { getRangeButtons } from './Utilities/rangeButtons';

const ChartComponent = ({ defaultRange, data } : PlotProps) => {

    const [range, setRange] = useState<Range>(defaultRange);
    const [dateFormat, setDateFormat] = useState<string>(rangeToFormat(range));
    const [step, setStep] = useState<Step>(rangeToStep(range));
    const [activeButtonIndex, setActiveButtonIndex] = useState<number>(0);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= mobileWidth);

    const rangeButtons = getRangeButtons(range, data)
    const filteredData = useMemo(() => filterData(range, data, isMobile), [range, data, isMobile]);

    const chartWrapRef = useRef<HTMLDivElement>(null);
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
    const areaGradientRef = useRef<SVGLinearGradientElement>(null);

    const dimensions = useResizeObserver(chartWrapRef);

    const handleRangeChange = (
        range: Range = defaultRange,
        index: number
    ) => {
        setRange(range);
        setDateFormat(rangeToFormat(range));
        setStep(rangeToStep(range));
        setActiveButtonIndex(index);
    };

    useEffect(() => {
        if (!dimensions) return;
        setIsMobile(window.innerWidth <= mobileWidth);
        
        const xAxisGenerator: d3.ScaleTime<number, number> = d3.scaleTime()
            .domain([range.rangeLeft, range.rangeRight])
            .range([0, dimensions.width - body.margin.right]);
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
            .domain([minForRange(filteredData, range), maxForRange(filteredData, range) * 1.1])
            .range([dimensions.height - body.margin.top - body.margin.bottom, 0]);
        yAxisRef.current && d3.select(yAxisRef.current)
            .call(d3.axisLeft(yAxisGenerator)
                .ticks(5, 's')
                .tickSize(0)
                .tickPadding(30))
            .select('.domain')
                .attr('opacity', '0');

        d3.select(areaGradientRef.current)
            .attr('x1', '0%').attr('y1', '0%')
            .attr('x2', '0%').attr('y2', '100%');
        
        d3.select(areaPathRef.current)
            .datum(filteredData)
            .attr('d', d3.area<DataPoint>()
                .defined((d) => d.date <= range.rangeRight && d.date >= range.rangeLeft)
                // .curve(d3.curveCardinal.tension(0.5))
                .x((d) => xAxisGenerator(d.date))
                .y0(yAxisGenerator(minForRange(filteredData, range)))
                .y1((d) => yAxisGenerator(d.value))
            );
        
        
        d3.select(linePathRef.current)
            .datum(filteredData)
            .attr('d', d3.line<DataPoint>()
                .defined((d) => d.date <= range.rangeRight && d.date >= range.rangeLeft)
                // .curve(d3.curveCardinal.tension(0.5))
                .x(d => xAxisGenerator(d.date))
                .y(d => yAxisGenerator(d.value))
            );

        const focusLine = d3.select(focusLineRef.current);

        const focusCircle = d3.select(focusCircleRef.current)

        const focusText = d3.select(focusTextRef.current);

        d3.select(pointerSpaceRef.current)
            .style('width', dimensions.width)
            .style('height', dimensions.height)
            .on('mouseover', () => {
                mouseover(focusCircle, focusText, focusLine);
            })
            .on('mousemove', () => {
                mousemove(xAxisGenerator, yAxisGenerator, filteredData, focusCircle, focusText, focusLine, range, dimensions);//, xAxisRef.current, yAxisRef.current);
            })
            .on('mouseout', () => {
                mouseout(focusCircle, focusText, focusLine);
            });

    }, [range, dimensions, filteredData, dateFormat, step]);

    return (
        <div styleName='wrapper'>
            <h2 styleName='title'>Abo analytics</h2>
            <div styleName='buttons'>
                {rangeButtons.map((value, index) => {
                    if (value.isEnabled) {
                        const styleName = activeButtonIndex === index ? 'button active' : 'button';
                        return (
                            <a 	key={index} 
                                styleName={styleName}
                                onClick = {
                                    () => handleRangeChange(
                                        { rangeLeft: value.date, rangeRight: defaultRange.rangeRight },
                                        index
                                    )
                                }
                                >{value.label}</a>
                        );
                    }
                })}
            </div>
            <div ref={chartWrapRef}>
                <svg ref={mainSvgRef} styleName='container'>
                    <g ref={chartBodyRef} styleName='chart-body'>
                        <g ref={xAxisRef} styleName='x-axis' />
                        <g ref={yAxisRef} styleName='y-axis' />
                        <defs>
                            <linearGradient ref={areaGradientRef} id='areaGradient'>
                                <stop offset='83.17%' styleName='gradient-start' />
                                <stop offset='99.18%' styleName='gradient-stop' />
                            </linearGradient>
                        </defs>
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
        </div>
    );
};

ChartComponent.propTypes = {
    defaultRange: PropTypes.any.isRequired,
    data: PropTypes.any.isRequired
}

export default ChartComponent;