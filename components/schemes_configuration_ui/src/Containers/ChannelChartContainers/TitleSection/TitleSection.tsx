import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { setHours } from 'date-fns';
import { useStore } from 'effector-react';

import { $activeChart } from '../../../Models/ActiveChannelChart';
import { setDateTimePeriod } from '../../../Models/ActiveChannelChart/events';
import ChartSettings from '../ChartSettings';
import NavigationForForms from '../NavigationForForms';

import TitleSectionProps from './types';

import styles from './TitleSection.module.css';

function TitleSection({ className }: TitleSectionProps) {
	const { isLoading, id, startDateTime, endDateTime } = useStore($activeChart);

	const [searchParams] = useSearchParams();

	useEffect(() => {
		const baseHour = searchParams.get('baseHour');
		if (baseHour) {
			setDateTimePeriod({
				startDateTime: setHours(startDateTime, Number(baseHour)),
				endDateTime: setHours(endDateTime, Number(baseHour)),
			});
		}
	}, [searchParams]);

	return (
		<div className={clsx(styles.root, className)}>
			{!isLoading && <NavigationForForms />}
			{id && <ChartSettings />}
		</div>
	);
}

export default TitleSection;
