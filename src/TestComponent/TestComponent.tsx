import './TestComponent.scss';

import React, { useState } from 'react';
import { Range } from '../Interfaces';
import ChartComponent from '../ChartComponent';
import data from '../Data';
import { rangeToFormat } from '../Utilities/RangeToFormat/index';

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
	leftRangeInit.setFullYear(leftRangeInit.getFullYear() - 2);

	const [range, setRange] = useState<Range>({ 
		rangeLeft: leftRangeInit,
		rangeRight: rightRangeInit
	});
	const [dateFormat, setDateFormat] = useState<string>('%d %b');

	const handleRange = (
		leftRangeDate: Date = range.rangeLeft, 
      	rightRangeDate: Date = range.rangeRight
    ) => {
		setRange({ ...range, rangeLeft: leftRangeDate, rangeRight: rightRangeDate });
		setDateFormat(rangeToFormat({ rangeLeft: leftRangeDate, rangeRight: rightRangeDate }));
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
						range.rangeRight.getFullYear() - 1,
						range.rangeRight.getMonth(), 
						range.rangeRight.getDate()
					), 
					range.rangeRight
					)}>1 year</button>
			<button onClick={() => handleRange(leftRangeInit, rightRangeInit)}>Default</button>
			<ChartComponent range={range} dateFormat={dateFormat} data={data} />
		</div>
	);
};

export default TestComponent;