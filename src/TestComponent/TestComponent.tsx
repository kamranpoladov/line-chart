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
	leftRangeInit.setDate(leftRangeInit.getDate() - 6);

	const [range, setRange] = useState<Range>({ 
		rangeLeft: leftRangeInit,
		rangeRight: rightRangeInit
	});
	const [dateFormat, setDateFormat] = useState<string>('%d.%m');

	const handleRange = (
		leftRangeDate: Date = range.rangeLeft, 
      	rightRangeDate: Date = range.rangeRight
    ) => {
		setRange({...range, rangeLeft: leftRangeDate, rangeRight: rightRangeDate});
		setDateFormat(rangeToFormat({rangeLeft: leftRangeDate, rangeRight: rightRangeInit}));
	};

	return (
		<div>
			<button onClick={() => handleRange(new Date(2020, 6, 4), rightRangeInit)}>Change range 1</button>
			<button onClick={() => handleRange(new Date(2019, 5, 28), new Date(2020, 6, 5))}>Change range 2</button>
			<ChartComponent range={range} dateFormat={dateFormat} data={data} />
		</div>
	);
};

export default TestComponent;