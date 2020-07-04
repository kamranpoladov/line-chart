import './TestComponent.scss';

import React, { useState } from 'react';
import { Range } from '../Interfaces';
import ChartComponent from '../ChartComponent';

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
	const [dateFormat, setDateFormat] = useState<string>('%m.%d');

	const handleRange = (
		leftRangeDate: Date = range.rangeLeft, 
      	rightRangeDate: Date = range.rangeRight
    ) => {
		setRange({...range, rangeLeft: leftRangeDate, rangeRight: rightRangeDate});
	};

	return (
		<div>
			<ChartComponent range={range} dateFormat={dateFormat} />
		</div>
	);
};

export default TestComponent;