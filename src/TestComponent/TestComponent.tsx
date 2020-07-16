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

	const handleRange = (
		leftRangeDate: Date = range.rangeLeft, 
      	rightRangeDate: Date = range.rangeRight
    ) => {
		setRange({ ...range, rangeLeft: leftRangeDate, rangeRight: rightRangeDate });
		setDateFormat(rangeToFormat({ rangeLeft: leftRangeDate, rangeRight: rightRangeDate }));
		setStep(rangeToStep({ rangeLeft: leftRangeDate, rangeRight: rightRangeDate }, window.innerWidth <= 450));
	};

	const rangeButtons = getRangeButtons(range, data);

	return (
		<div styleName='wrapper'>
			<DateRangePicker
				startDate={moment(range.rangeLeft)}
				startDateId='start_id'
				endDate={moment(range.rangeRight)}
				endDateId='end_id'
				onDatesChange={({ startDate, endDate }) => handleRange(startDate?.toDate(), endDate?.toDate())}
				focusedInput={focusedInput}
				onFocusChange={focusedInput => setFocusedInput(focusedInput)}
				isOutsideRange={(day) => !isInclusivelyBeforeDay(day, moment())}
				orientation={"horizontal"}
				numberOfMonths={1}
			/>
			<div styleName='buttons'>
				{rangeButtons.map((value, index) => {
					if (value.isEnabled) {
						return (
							<a 	key={index} 
								styleName='range-button'
								onClick = {
									() => handleRange(value.date, rightRangeInit)
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