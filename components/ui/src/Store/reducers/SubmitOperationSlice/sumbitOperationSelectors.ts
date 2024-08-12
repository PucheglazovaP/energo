import { RootState } from '../../store';

export const selectSubmitOperation = (state: RootState) => {
	const { isOpen, body, title, submitOperation, submitButtonText } =
		state.submitOperationReducer;
	return { isOpen, body, title, submitOperation, submitButtonText };
};
