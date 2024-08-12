import { RootState } from '../../store';

export const selectSupportTooltipMode = (state: RootState) => {
	return state.appReducer.isSupportTooltipMode;
};
