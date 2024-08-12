import React from 'react';
import clsx from 'clsx';

import Input from '../../UI/Input';

import { DeviceParameterProps } from './types';
import { useDeviceParameter } from './useDeviceParameter';

import styles from './DeviceReports.module.css';

export function DeviceParameter({
	deviceParameter,
	onEditDeviceParameter,
}: DeviceParameterProps) {
	const { onEnterPress, onChangeValue, currentValue } = useDeviceParameter({
		deviceParameter,
		onEditDeviceParameter,
	});
	return (
		<div className={styles.parameter_item} key={deviceParameter.name}>
			<span className={styles.parameter_name} title={deviceParameter.name}>
				{deviceParameter.name}
			</span>
			<Input
				title={currentValue || ''}
				className={clsx(
					styles.parameter_value,
					currentValue !== deviceParameter.value &&
						styles.parameter_value__changed,
				)}
				value={currentValue || ''}
				onChange={onChangeValue}
				onKeyUp={onEnterPress}
			/>
		</div>
	);
}
