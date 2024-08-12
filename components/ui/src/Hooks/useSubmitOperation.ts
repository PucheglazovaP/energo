import { useCallback } from 'react';

import { submitActions } from '../Components/SubmitOperation/const';
import {
	closeSubmitOperationModal,
	openSubmitOperationModal,
} from '../Store/reducers/SubmitOperationSlice/SubmitOperationSlice';
import { selectSubmitOperation } from '../Store/reducers/SubmitOperationSlice/sumbitOperationSelectors';

import useAppDispatch from './Store/useAppDispatch';
import { useAppSelector } from './Store/useAppSelector';

export const useSubmitOperation = () => {
	const dispatch = useAppDispatch();
	const { isOpen, body, title, submitOperation, submitButtonText } =
		useAppSelector(selectSubmitOperation);
	const handleOpenSubmitOperation = useCallback(() => {
		dispatch(openSubmitOperationModal());
	}, [dispatch]);

	const handleCloseSubmitOperation = useCallback(() => {
		dispatch(closeSubmitOperationModal());
	}, [dispatch]);

	const submitFunction = useCallback(() => {
		dispatch(submitActions[submitOperation]);
		dispatch(closeSubmitOperationModal());
	}, [submitOperation]);

	return {
		openSubmitOperation: handleOpenSubmitOperation,
		closeSubmitOperation: handleCloseSubmitOperation,
		isSubmitOperationOpen: isOpen,
		submitOperationTitle: title,
		submitOperationBody: body,
		submitButtonText,
		submitFunction,
	};
};
