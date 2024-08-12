import { ChangeEvent, useEffect, useMemo, useReducer, useState } from 'react';
import { addDays } from 'date-fns';
import { useStore } from 'effector-react';

import { $user } from '../../../Models/Auth';
import {
	deletePrintFormParameterValueFx,
	updatePrintFormParameterValueFx,
} from '../../../Models/PrintForms/effects';
import { checkIsMaxDate } from '../../../Shared/checkIsMaxDate';
import { MAX_DATE } from '../../../Shared/const';
import { PrintFormParameterValue, User } from '../../../Shared/types';
import { ModuleName } from '../../../Shared/Types/moduleName';
import { DateFormat, formatDate } from '../../../Utils/dateUtils';

import { parameterValueReducer } from './parameterValueReducer';
import { ParameterValueActionsTypes } from './types';

function usePrintFormParameterValueForm(
	valueId: number,
	valueName: string,
	isActive: boolean,
	dateFrom: Date,
	dateTo: Date,
) {
	const user: User | null = useStore($user);
	const [parameterValue, dispatch] = useReducer(
		parameterValueReducer,
		{ valueId, valueName, isActive, dateFrom, dateTo } ||
			({} as PrintFormParameterValue),
	);
	const isEndDateExists: boolean = useMemo(
		() => !checkIsMaxDate(dateTo),
		[dateTo],
	);
	const [isCheckboxChecked, setIsCheckboxChecked] =
		useState<boolean>(isEndDateExists);

	function handleIsEndDateExistsChange() {
		setIsCheckboxChecked(!isCheckboxChecked);
		dispatch({
			type: ParameterValueActionsTypes.ChangeIsEndDateExists,
			isEndDateExists: !isCheckboxChecked,
		});
		handleValueUpdate(
			!isCheckboxChecked ? addDays(parameterValue.dateFrom, 1) : MAX_DATE,
		);
	}
	function handleValueNameChange(evt: ChangeEvent<HTMLTextAreaElement>) {
		dispatch({ type: ParameterValueActionsTypes.ChangeName, evt });
	}
	function handleDateFromChange(period: Date[]) {
		dispatch({ type: ParameterValueActionsTypes.ChangeDateFrom, period });
	}
	function handleDateToChange(period: Date[]) {
		dispatch({ type: ParameterValueActionsTypes.ChangeDateTo, period });
	}
	function handleValueUpdate(endDate: Date) {
		if (user) {
			const params = {
				userId: user.preferredUsername,
				linkId: parameterValue.valueId,
				name: parameterValue.valueName || 'Без названия',
				dateFrom: formatDate(
					parameterValue.dateFrom,
					DateFormat.DisplayDatabaseFormat,
				),
				dateTo: formatDate(endDate, DateFormat.DisplayDatabaseFormat),
				moduleName:
					ModuleName.UsePrintFormParameterValueForm_updatePrintFormParameterValueFx,
			};
			updatePrintFormParameterValueFx(params);
		}
	}

	function handleFieldBlur() {
		if (!parameterValue.valueName) {
			dispatch({ type: ParameterValueActionsTypes.ChangeEmptyValueName });
		}
		handleValueUpdate(parameterValue.dateTo);
	}

	function handleDelete() {
		if (user) {
			deletePrintFormParameterValueFx({
				linkId: parameterValue.valueId,
				userId: user.preferredUsername,
				moduleName:
					ModuleName.UsePrintFormParameterValueForm_deletePrintFormParameterValueFx,
			});
		}
	}

	useEffect(() => {
		dispatch({
			type: ParameterValueActionsTypes.ChangeIsEndDateExists,
			isEndDateExists,
		});
		setIsCheckboxChecked(isEndDateExists);
	}, [isEndDateExists]);

	useEffect(() => {
		dispatch({
			type: ParameterValueActionsTypes.Set,
			parameterValue: { valueId, dateFrom, dateTo, isActive, valueName },
		});
		const isEndDateExists = !checkIsMaxDate(dateTo);
		setIsCheckboxChecked(isEndDateExists);
	}, [dateFrom, valueId, dateTo, isActive, valueName]);

	return {
		...parameterValue,
		isEndDateExists: isCheckboxChecked,
		handleIsEndDateExistsChange,
		handleValueNameChange,
		handleDateFromChange,
		handleDateToChange,
		handleFieldBlur,
		handleDelete,
	};
}

export default usePrintFormParameterValueForm;
