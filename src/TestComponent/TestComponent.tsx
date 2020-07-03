import './TestComponent.scss';

import React, { useState } from 'react';

const TestComponent = () => {
	const 
		rightRangeInit = new Date(),
		leftRangeInit = new Date();
	leftRangeInit.setDate(leftRangeInit.getDate() - 7);

	const [range, setRange] = useState<Range>({ 
		rangeLeft: leftRangeInit,
		rangeRight: rightRangeInit
	});

	const handleRange = (
		leftRangeDate: Date | null = range.rangeLeft, 
      	rightRangeDate: Date | null = range.rangeRight
    ) => {
		setRange({...range, rangeLeft: leftRangeDate, rangeRight: rightRangeDate});
	}

	return (
		<div>

		</div>
	);
};

interface Range {
	rangeLeft: Date | null,
	rangeRight: Date | null
};

export default TestComponent;
