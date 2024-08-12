import { addDays } from 'date-fns';

import { checkIsMaxDate } from '../../../Shared/checkIsMaxDate';
import { MAX_DATE } from '../../../Shared/const';
import { PrintFormParameterValue } from '../../../Shared/types';

import { ParameterValueActions, ParameterValueActionsTypes } from './types';

export function parameterValueReducer(
	parameterValue: PrintFormParameterValue,
	action: ParameterValueActions,
): PrintFormParameterValue {
	switch (action.type) {
		case ParameterValueActionsTypes.Set: {
			return action.parameterValue;
		}
		case ParameterValueActionsTypes.ChangeName: {
			return { ...parameterValue, valueName: action.evt.target.value };
		}
		case ParameterValueActionsTypes.ChangeDateFrom: {
			return { ...parameterValue, dateFrom: action.period[0] || new Date() };
		}
		case ParameterValueActionsTypes.ChangeDateTo: {
			return {
				...parameterValue,
				dateTo: action.period[0] || new Date(),
			};
		}
		case ParameterValueActionsTypes.ChangeIsEndDateExists: {
			const dateTo = action.isEndDateExists
				? checkIsMaxDate(parameterValue.dateTo)
					? addDays(parameterValue.dateFrom, 1)
					: parameterValue.dateTo
				: MAX_DATE;

			return {
				...parameterValue,
				dateTo,
			};
		}
		case ParameterValueActionsTypes.ChangeEmptyValueName: {
			return {
				...parameterValue,
				valueName: 'Без названия',
			};
		}

		default:
			return parameterValue;
	}
}
