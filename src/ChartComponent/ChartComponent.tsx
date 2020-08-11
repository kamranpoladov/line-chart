import "./ChartComponent.scss";

import * as d3 from "d3";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { filterData } from "./Data/filterData";
import { DataPoint, PlotProps, Range, Step } from "./Interfaces";
import { body, mobileWidth } from "./Utilities/constants";
import { mousemove, mouseout, mouseover } from "./Utilities/cursor";
import { dataWithinRange } from "./Utilities/dataWithinRange";
import { rangeToFormat, rangeToStep } from "./Utilities/formatDate";
import {
  getMarginLeftByData,
  getMarginLeftByValue,
  getMarginRightByValue,
} from "./Utilities/labelToOffsets";
import { maxValueForRange, minValueForRange } from "./Utilities/maxMin";
import { useResizeObserver } from "./Utilities/resizeObserver";
import { validateRange } from "./Utilities/validateRange";
import { getRangeButtons } from "./Utilities/rangeButtons";

const ChartComponent = ({
  range,
  data,
  height,
  heightPercentage = 30,
}: PlotProps) => {
  const [isMobile, setIsMobile] = useState<boolean>(
    window.innerWidth <= mobileWidth
  );
  const [processedRange, setProcessedRange] = useState<Range>(
    validateRange(data, range)
  );
  const filteredData = useMemo(
    () => filterData(processedRange, data, isMobile),
    [processedRange, data, isMobile]
  );
  const [hasData, setHasData] = useState<boolean>(
    dataWithinRange(filteredData, processedRange)
  );
  const [activeButtonIndex, setActiveButtonIndex] = useState<number>(0);
  const rangeButtons = getRangeButtons(processedRange, filteredData);

  const [dateFormat, setDateFormat] = useState<string>(
    rangeToFormat(processedRange)
  );
  const [step, setStep] = useState<Step>(rangeToStep(processedRange));

  // Handle range change from outside of component
  useEffect(() => {
    if (range !== processedRange) {
      setProcessedRange(validateRange(filteredData, range));
      setActiveButtonIndex(-1);
      setDateFormat(rangeToFormat(validateRange(filteredData, range)));
      setStep(rangeToStep(validateRange(filteredData, range)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const chartWrapRef = useRef<HTMLDivElement>(null);
  const mainSvgRef = useRef<SVGSVGElement>(null);
  const chartBodyRef = useRef<SVGGElement>(null);
  const xAxisRef = useRef<SVGGElement>(null);
  const yAxisRef = useRef<SVGGElement>(null);
  const areaPathRef = useRef<SVGPathElement>(null);
  const linePathRef = useRef<SVGPathElement>(null);
  const focusLineRef = useRef<SVGLineElement>(null);
  const focusCircleRef = useRef<SVGCircleElement>(null);
  const pointerSpaceRef = useRef<SVGRectElement>(null);
  const areaGradientRef = useRef<SVGLinearGradientElement>(null);
  const focusTextBoxRef = useRef<HTMLDivElement>(null);
  const focusTextValueRef = useRef<HTMLSpanElement>(null);
  const focusTextDateRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = d3.select(mainSvgRef.current);
    if (height) {
      container.style("min-height", `${height}px`);
    } else if (heightPercentage) {
      container.style("min-height", `${heightPercentage}vw`);
    } else {
      container.style("min-height", "30vw");
    }
  }, [height, heightPercentage]);

  const dimensions = useResizeObserver(chartWrapRef);

  const handleRangeChange = (rangeToSet: Range = range, index: number) => {
    setProcessedRange(validateRange(filteredData, rangeToSet));
    setDateFormat(rangeToFormat(validateRange(filteredData, rangeToSet)));
    setStep(rangeToStep(validateRange(filteredData, rangeToSet)));
    setActiveButtonIndex(index);
  };

  useEffect(() => {
    if (!dimensions) return;
    setIsMobile(window.innerWidth <= mobileWidth);
    setHasData(dataWithinRange(filteredData, processedRange));

    const yAxisGenerator: d3.ScaleLinear<number, number> = d3
      .scaleLinear()
      .domain([
        minValueForRange(filteredData, processedRange),
        maxValueForRange(filteredData, processedRange) * 1.1,
      ])
      .range([dimensions.height - body.margin.bottom - body.margin.top, 0]);
    yAxisRef.current &&
      d3
        .select(yAxisRef.current)
        .call(
          d3
            .axisLeft(yAxisGenerator)
            .ticks(4, "s")
            .tickSize(0)
            .tickPadding(27)
            .tickSizeInner(
              -(
                dimensions.width -
                getMarginLeftByData(filteredData, processedRange)
              )
            )
        )
        .select(".domain")
        .attr("opacity", "0");
    d3.selectAll(".tick > line").attr("stroke", "rgba(0, 0, 0, 0.03)");

    const yAxisTicks = (d3.selectAll(".y-axis > .tick") as any)._groups[0];
    const maxLabelLength =
      yAxisTicks[yAxisTicks.length - 1]?.textContent.length;

    const xAxisGenerator: d3.ScaleTime<number, number> = d3
      .scaleTime()
      .domain([processedRange.rangeLeft, processedRange.rangeRight])
      .range([0, dimensions.width - getMarginRightByValue(maxLabelLength)]);
    xAxisRef.current &&
      d3
        .select(xAxisRef.current)
        .attr(
          "transform",
          `translate(0, ${dimensions.height - body.margin.bottom})`
        )
        .call(
          d3
            .axisBottom(xAxisGenerator)
            .tickSize(0)
            .tickFormat(d3.timeFormat(dateFormat) as () => string)
            .ticks(step.intervalFunction)
            .tickPadding(20)
        )
        .select(".domain")
        .attr("opacity", "0");

    d3.select(areaGradientRef.current)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    d3.select(areaPathRef.current)
      .datum(filteredData)
      .attr(
        "d",
        d3
          .area<DataPoint>()
          .defined(
            (d) =>
              d.date <= processedRange.rangeRight &&
              d.date >= processedRange.rangeLeft
          )
          .x((d) => xAxisGenerator(d.date))
          .y0(yAxisGenerator(minValueForRange(filteredData, processedRange)))
          .y1((d) => yAxisGenerator(d.value))
      );

    d3.select(linePathRef.current)
      .datum(filteredData)
      .attr(
        "d",
        d3
          .line<DataPoint>()
          .defined(
            (d) =>
              d.date <= processedRange.rangeRight &&
              d.date >= processedRange.rangeLeft
          )
          .x((d) => xAxisGenerator(d.date))
          .y((d) => yAxisGenerator(d.value))
      );

    const focusLine = d3.select(focusLineRef.current);

    const focusCircle = d3.select(focusCircleRef.current);

    const focusTextBox = d3.select(focusTextBoxRef.current);

    const focusTextValue = d3.select(focusTextValueRef.current);

    const focusTextDate = d3.select(focusTextDateRef.current);

    hasData &&
      d3
        .select(pointerSpaceRef.current)
        .style("width", dimensions.width + body.margin.left)
        .style("height", dimensions.height)
        .on("mouseover", () => {
          mouseover(
            focusCircle,
            focusTextBox,
            focusTextValue,
            focusTextDate,
            focusLine
          );
        })
        .on("mousemove", () => {
          mousemove(
            xAxisGenerator,
            yAxisGenerator,
            filteredData,
            focusCircle,
            focusTextBox,
            focusTextValue,
            focusTextDate,
            focusLine,
            processedRange,
            dimensions,
            +getMarginLeftByValue(maxLabelLength).replace("rem", "") * 10
          ); //, xAxisRef.current, yAxisRef.current);
        })
        .on("mouseout", () => {
          mouseout(
            focusCircle,
            focusTextBox,
            focusTextValue,
            focusTextDate,
            focusLine
          );
        });

    d3.select(chartBodyRef.current).style(
      "transform",
      `translate(${getMarginLeftByValue(maxLabelLength)}, 1rem)`
    );
  }, [processedRange, dimensions, filteredData, dateFormat, step, hasData]);

  return (
    <div styleName="wrapper">
      {!hasData && <div styleName="no-data-found">NO DATA FOUND &#128557;</div>}
      {/* {!hasData && <div styleName="no-data-found"></div>} */}

      <div styleName="buttons">
        {rangeButtons.map((value, index) => {
          if (value.isEnabled) {
            const styleName =
              activeButtonIndex === index ? "button active" : "button";
            return (
              <a
                key={index}
                styleName={styleName}
                onClick={() => {
                  return handleRangeChange(
                    {
                      rangeLeft: value.date,
                      rangeRight: processedRange.rangeRight,
                    },
                    index
                  );
                }}
              >
                {value.label}
              </a>
            );
          }
        })}
      </div>
      <div ref={chartWrapRef}>
        <div ref={focusTextBoxRef} styleName="focus-box">
          <span ref={focusTextValueRef} styleName="focus-text-value">
            0
          </span>
          <span ref={focusTextDateRef} styleName="focus-text-date">
            0
          </span>
        </div>
        <svg ref={mainSvgRef} styleName="container">
          <g ref={chartBodyRef}>
            <g ref={xAxisRef} styleName="x-axis" />
            <g ref={yAxisRef} styleName="y-axis" className="y-axis" />
            <defs>
              <linearGradient ref={areaGradientRef} id="areaGradient">
                <stop offset="83.17%" styleName="gradient-start" />
                <stop offset="99.18%" styleName="gradient-stop" />
              </linearGradient>
            </defs>
            <path ref={areaPathRef} styleName="area-path" />
            <path ref={linePathRef} styleName="line-path" />
            <g>
              <line ref={focusLineRef} styleName="focus-line" />
              <circle ref={focusCircleRef} styleName="focus-circle" />
            </g>
            <rect ref={pointerSpaceRef} styleName="pointer-space" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default ChartComponent;
