import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './TestComponent.scss';

import React, { useState } from 'react';
import { Range, Step } from '../Interfaces';
import ChartComponent from '../ChartComponent';
import data from '../Data';
import { rangeToFormat, rangeToStep } from '../Utilities/FormatDate/index';
import { DateRangePicker, isInclusivelyBeforeDay, FocusedInputShape } from 'react-dates';
import moment from 'moment';

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
				<a styleName='range-button' 
					onClick={
					() => handleRange(
						new Date(
							range.rangeRight.getFullYear(),
							range.rangeRight.getMonth(), 
							range.rangeRight.getDate() - 6
						), 
						range.rangeRight
						)}>1 week</a>
				<a styleName='range-button' 
					onClick={
					() => handleRange(
						new Date(
							range.rangeRight.getFullYear(),
							range.rangeRight.getMonth(), 
							range.rangeRight.getDate() - 13
						), 
						range.rangeRight
						)}>2 weeks</a>
				<a styleName='range-button' 
					onClick={
					() => handleRange(
						new Date(
							range.rangeRight.getFullYear(),
							range.rangeRight.getMonth() - 1, 
							range.rangeRight.getDate()
						), 
						range.rangeRight
						)}>4 weeks</a>
				<a styleName='range-button' 
					onClick={
					() => handleRange(
						new Date(
							range.rangeRight.getFullYear(),
							range.rangeRight.getMonth() - 2, 
							range.rangeRight.getDate()
						), 
						range.rangeRight
						)}>2 months</a>
				<a styleName='range-button' 
					onClick={
					() => handleRange(
						new Date(
							range.rangeRight.getFullYear(),
							range.rangeRight.getMonth() - 3, 
							range.rangeRight.getDate()
						), 
						range.rangeRight
						)}>3 months</a>
				<a styleName='range-button' 
					onClick={
					() => handleRange(
						new Date(
							range.rangeRight.getFullYear(),
							range.rangeRight.getMonth() - 6, 
							range.rangeRight.getDate()
						), 
						range.rangeRight
						)}>6 months</a>
				<div styleName='dropdown'>
					<a styleName='range-button'>
						More
					</a>
					<div styleName='dropdown-content'>
						<a styleName='range-button' 
						onClick={
						() => handleRange(
							new Date(
								range.rangeRight.getFullYear() - 1,
								range.rangeRight.getMonth(), 
								range.rangeRight.getDate()
							), 
							range.rangeRight
							)}>1 year</a>
					<a styleName='range-button' 
						onClick={
						() => handleRange(
							new Date(
								range.rangeRight.getFullYear() - 3,
								range.rangeRight.getMonth(), 
								range.rangeRight.getDate()
							), 
							range.rangeRight
							)}>3 years</a>
					<a styleName='range-button'
						onClick={
						() => handleRange(
							new Date(
								range.rangeRight.getFullYear() - 5,
								range.rangeRight.getMonth(), 
								range.rangeRight.getDate()
							), 
							range.rangeRight
							)}>5 years</a>
					</div>
				</div>
			</div>
			<ChartComponent range={range} dateFormat={dateFormat} data={data} step={step} />
		</div>
	);
};

export default TestComponent;