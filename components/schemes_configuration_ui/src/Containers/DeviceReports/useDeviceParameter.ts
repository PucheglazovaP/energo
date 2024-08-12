import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { ModuleName } from '../../Shared/Types/moduleName';

import { DeviceParameterProps } from './types';

export function useDeviceParameter({
	deviceParameter,
	onEditDeviceParameter,
}: DeviceParameterProps) {
	const user = useStore($user);
	const { value, name } = deviceParameter;
	// Текущее значение параметра в input
	const [currentValue, setCurrentValue] = useState(value);

	// Callback для изменения текущего состояния значения Input
	const onChangeValue = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setCurrentValue(e.target.value);
	}, []);

	// Обработка нажатия клавиши Enter для сохранения текущего значения параметра
	const onEnterPress = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (!user) return;
			if (event.key === 'Enter') {
				onEditDeviceParameter({
					name: name,
					value: currentValue,
					userId: user.preferredUsername,
					moduleName: ModuleName.UseDeviceParameter_onEditDeviceParameter,
				});
			}
		},
		[currentValue, name, onEditDeviceParameter, user],
	);

	// Изменение значений input при изменении значений параметра (изменение активного прибора)
	useEffect(() => {
		setCurrentValue(value);
	}, [value]);

	return {
		currentValue,
		onChangeValue,
		onEnterPress,
	};
}
