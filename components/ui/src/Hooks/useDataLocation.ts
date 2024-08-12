import { useCallback } from 'react';

import { ModuleName } from '../Shared/types';
import { getDataLocationRpc } from '../Store/reducers/DataLocationSlice/DataLocationActions';
import { selectIsModalOpen } from '../Store/reducers/DataLocationSlice/DataLocationSelectors';
import {
	closeParametersModal,
	openParametersModal,
} from '../Store/reducers/DataLocationSlice/DatalocationSlice';

import useAppDispatch from './Store/useAppDispatch';
import { useAppSelector } from './Store/useAppSelector';

export const useDataLocation = () => {
	const dispatch = useAppDispatch();
	const isDataLocationOpen = useAppSelector(selectIsModalOpen);
	const handleOpenParametersModal = useCallback(() => {
		dispatch(openParametersModal());
	}, [dispatch]);

	const handleCloseParametersModal = useCallback(() => {
		dispatch(closeParametersModal());
	}, [dispatch]);

	const getDataLocation = useCallback(
		(id: number, userId?: string) => {
			dispatch(
				getDataLocationRpc({
					channelNumber: id,
					userId: userId,
					moduleName: ModuleName.UseDataLocation_getDataLocationRpc,
					error: null,
					textError: null,
				}),
			);
		},
		[dispatch],
	);
	return {
		openParametersModal: handleOpenParametersModal,
		closeParametersModal: handleCloseParametersModal,
		isDataLocationOpen,
		getDataLocation,
	};
};
