import React from 'react';

import { DeviceParameter } from './DeviceParameter';
import { DeviceParametersProps } from './types';

import styles from './DeviceReports.module.css';

export function DeviceParameters({
	deviceParameters,
	onEditDeviceParameter,
}: DeviceParametersProps) {
	return (
		<div className={styles.device_parameters_container}>
			<h3>ПАРАМЕТРЫ</h3>
			<div className={styles.device_parameters}>
				{deviceParameters.map((deviceParameter) => (
					<div key={deviceParameter.name}>
						<DeviceParameter
							deviceParameter={deviceParameter}
							onEditDeviceParameter={onEditDeviceParameter}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
