import './TestComponent.scss';

import React, { useState } from 'react';
import { Range, Step } from '../Interfaces';
import ChartComponent from '../ChartComponent';
import data from '../Data';
import { rangeToFormat, rangeToStep } from '../Utilities/FormatDate/index';
import * as d3 from 'd3';

const TestComponent: React.FunctionComponent = () => {
	// Set up default range: 1 week
	// Use only year, month and day, remove any timestamps
	const
		rightRangeInit = new Date(
			new Date().getFullYear(), 
			new Date().getMonth(), 
			new Date().getDate()),
		leftRangeInit = new Date(
			new Date().getFullYear(), 
			new Date().getMonth(), 
			new Date().getDate());
	leftRangeInit.setDate(leftRangeInit.getDate() - 6);

	const [range, setRange] = useState<Range>({ 
		rangeLeft: leftRangeInit,
		rangeRight: rightRangeInit
	});
	const [dateFormat, setDateFormat] = useState<string>(rangeToFormat(range));
	const [step, setStep] = useState<Step>(rangeToStep(range));

	const handleRange = (
		leftRangeDate: Date = range.rangeLeft, 
      	rightRangeDate: Date = range.rangeRight
    ) => {
		setRange({ ...range, rangeLeft: leftRangeDate, rangeRight: rightRangeDate });
		setDateFormat(rangeToFormat({ rangeLeft: leftRangeDate, rangeRight: rightRangeDate }));
		setStep(rangeToStep({ rangeLeft: leftRangeDate, rangeRight: rightRangeDate }));
	};

	return (
		<div>
			<button onClick={
				() => handleRange(
					new Date(
						range.rangeRight.getFullYear(),
						range.rangeRight.getMonth(), 
						range.rangeRight.getDate() - 6
					), 
					range.rangeRight
					)}>1 week</button>
			<button onClick={
				() => handleRange(
					new Date(
						range.rangeRight.getFullYear(),
						range.rangeRight.getMonth(), 
						range.rangeRight.getDate() - 13
					), 
					range.rangeRight
					)}>2 weeks</button>
			<button onClick={
				() => handleRange(
					new Date(
						range.rangeRight.getFullYear(),
						range.rangeRight.getMonth(), 
						range.rangeRight.getDate() - 27
					), 
					range.rangeRight
					)}>4 weeks</button>
			<button onClick={
				() => handleRange(
					new Date(
						range.rangeRight.getFullYear(),
						range.rangeRight.getMonth() - 2, 
						range.rangeRight.getDate()
					), 
					range.rangeRight
					)}>2 months</button>
			<button onClick={
				() => handleRange(
					new Date(
						range.rangeRight.getFullYear(),
						range.rangeRight.getMonth() - 3, 
						range.rangeRight.getDate()
					), 
					range.rangeRight
					)}>3 months</button>
			<button onClick={
				() => handleRange(
					new Date(
						range.rangeRight.getFullYear(),
						range.rangeRight.getMonth() - 6, 
						range.rangeRight.getDate()
					), 
					range.rangeRight
					)}>6 months</button>
			<button onClick={
				() => handleRange(
					new Date(
						range.rangeRight.getFullYear() - 1,
						range.rangeRight.getMonth(), 
						range.rangeRight.getDate()
					), 
					range.rangeRight
					)}>1 year</button>
			<button onClick={
				() => handleRange(
					new Date(
						range.rangeRight.getFullYear() - 2,
						range.rangeRight.getMonth(), 
						range.rangeRight.getDate()
					), 
					range.rangeRight
					)}>2 years</button>
			<button onClick={
				() => handleRange(
					new Date(
						range.rangeRight.getFullYear() - 5,
						range.rangeRight.getMonth(), 
						range.rangeRight.getDate()
					), 
					range.rangeRight
					)}>5 years</button>
			<ChartComponent range={range} dateFormat={dateFormat} data={data} step={step} />
		</div>
	);
};

export default TestComponent;