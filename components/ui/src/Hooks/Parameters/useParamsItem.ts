import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { CHANNEL } from '../../Const';
import { copyToBuffer } from '../../Const/utils';
import {
	editParameterData,
	removeParametersItem,
} from '../../Store/reducers/ParametersSlice/parametersSlice';
import { ParamsList } from '../../Types/ParametersBlockTypes';
import useAppDispatch from '../Store/useAppDispatch';
import useDebounce from '../useDebounce';

export function useParamsItem(params: ParamsList) {
	const { value, placeholder, header, onAddClick } = params;
	const [currentValue, setCurrentValue] = useState(value);
	const dispatch = useAppDispatch();

	useEffect(() => {
		setCurrentValue(value);
	}, [value]);

	const [currentDate, setCurrentDate] = useState<Date[]>([]);

	const handlePeriodSelect = useCallback((period: Date[]) => {
		setCurrentDate(period);
		setCurrentValue(String(period[0]));
		onAddClick && onAddClick(String(period[0]))();
	}, []);

	const handleParamsItemChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setCurrentValue(e.target.value);
		},
		[],
	);
	const debouncedValue = useDebounce(String(currentValue), 1000);

	useEffect(() => {
		if (debouncedValue !== value) {
			dispatch(
				editParameterData({
					header: String(header),
					placeholder: placeholder,
					value: currentValue,
				}),
			);
		}
	}, [debouncedValue]);

	const dropdownHandler = useCallback((id: number) => {
		setCurrentValue(id);
	}, []);

	const closeItemClickHandler = useCallback(
		(id: number) => () => {
			dispatch(removeParametersItem({ id: id, parameterType: CHANNEL }));
		},
		[],
	);
	const copyClickHandler = useCallback(() => {
		copyToBuffer(String(currentValue));
	}, [currentValue]);
	return {
		currentDate,
		currentValue,
		handlePeriodSelect,
		handleParamsItemChange,
		closeItemClickHandler,
		copyClickHandler,
		dropdownHandler,
	};
}
