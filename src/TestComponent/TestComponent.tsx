import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './TestComponent.scss';

import React, { useState } from 'react';
import { Range, Step } from '../Shared/Interfaces';
import ChartComponent from '../ChartComponent';
import data from '../Shared/Data';
import { rangeToFormat, rangeToStep } from './Utilities/formatDate';
import { DateRangePicker, isInclusivelyBeforeDay, FocusedInputShape } from 'react-dates';
import moment from 'moment';
import { getRangeButtons } from './Utilities/rangeButtons';

const TestComponent: React.FunctionComponent = () => {
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
	const [step, setStep] = useState<Step>(rangeToStep(range, window.innerWidth <= 450));
	const [focusedInput, setFocusedInput] = useState<FocusedInputShape | null>(null);
	const [activeButtonIndex, setActiveButtonIndex] = useState<number>(0);

	const handleRange = (
		leftRangeDate: Date = range.rangeLeft, 
		rightRangeDate: Date = range.rangeRight,
		index: number 
    ) => {
		setRange({ ...range, rangeLeft: leftRangeDate, rangeRight: rightRangeDate });
		setDateFormat(rangeToFormat({ rangeLeft: leftRangeDate, rangeRight: rightRangeDate }));
		setStep(rangeToStep({ rangeLeft: leftRangeDate, rangeRight: rightRangeDate }, window.innerWidth <= 450));
		setActiveButtonIndex(index);
	};

	const rangeButtons = getRangeButtons(range, data);

	return (
		<div styleName='wrapper'>
			<h2>Abo analytics</h2>
			<div styleName='buttons'>
				{rangeButtons.map((value, index) => {
					if (value.isEnabled) {
						const styleName = activeButtonIndex === index ? 'range-button active' : 'range-button';
						return (
							<a 	key={index} 
								styleName={styleName}
								onClick = {
									() => handleRange(value.date, rightRangeInit, index)
								}
								>{value.label}</a>
						);
					}
				})}
			</div>
			<ChartComponent range={range} dateFormat={dateFormat} data={data} step={step} />
		</div>
	);
};

export default TestComponent;