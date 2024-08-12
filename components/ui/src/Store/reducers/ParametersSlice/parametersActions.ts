import { ParameterItem } from '../../../Types';
import { ParamItem } from '../../../Types/ParametersBlockTypes';
import { AppDispatch, RootState } from '../../store';

import {
	parametersSlice,
	removeParameterItem,
	setIsCreating,
} from './parametersSlice';

export const setParameters =
	(parameterItem: ParameterItem) => (dispatch: AppDispatch) => {
		const { setParameterItems } = parametersSlice.actions;
		try {
			dispatch(setParameterItems([parameterItem]));
			dispatch(setIsCreating(false));
		} catch (e) {
			console.log(e);
		}
	};
export const addParameters =
	(parameterItem: ParameterItem) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const { addParameterItems } = parametersSlice.actions;
		try {
			const index = getState().parameterReducer.parameterItems?.findIndex(
				(item: ParameterItem) => {
					return (
						item.parameterId === parameterItem.parameterId &&
						item.parameterType === parameterItem.parameterType
					);
				},
			);
			if (index !== undefined && index !== -1) {
				dispatch(removeParameterItem(index));
			} else {
				dispatch(addParameterItems([parameterItem]));
			}
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(setIsCreating(false));
		}
	};

export const setParamsItemValue =
	(paramsHeader: string, paramItem: ParamItem) =>
	(dispatch: AppDispatch, getState: () => RootState) => {
		const header = getState().parameterReducer.parametersData?.find(
			(item: any) => item.header === paramsHeader,
		);
		const res = header?.sortParams.find(
			(param: any) => param.placeholder === paramItem.placeholder,
		);
		console.log(res);
	};
