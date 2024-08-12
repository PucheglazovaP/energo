import { useCallback } from 'react';

import { getDuplicatesRpc } from '../Store/reducers/DuplicatesSlice/DuplicatesActions';
import { selectIsModalDuplicatesOpen } from '../Store/reducers/DuplicatesSlice/DuplicatesSelectors';
import {
	closeDuplicatesModal,
	openDuplicatesModal,
} from '../Store/reducers/DuplicatesSlice/DuplicatesSlice';

import useAppDispatch from './Store/useAppDispatch';
import { useAppSelector } from './Store/useAppSelector';

export const useFindDuplicates = () => {
	const dispatch = useAppDispatch();
	const isFindDuplicatesOpen = useAppSelector(selectIsModalDuplicatesOpen);
	const handleOpenFindDuplicates = useCallback(() => {
		dispatch(openDuplicatesModal());
	}, [dispatch]);

	const handleCloseFindDuplicates = useCallback(() => {
		dispatch(closeDuplicatesModal());
	}, [dispatch]);

	const getFindDuplicates = useCallback(
		(id: number) => {
			dispatch(
				getDuplicatesRpc({
					Name: '@Number',
					DbType: 'int',
					Value: id,
					Direction: 'Input',
				}),
			);
		},
		[dispatch],
	);
	return {
		openDuplicatesModal: handleOpenFindDuplicates,
		closeDuplicatesModal: handleCloseFindDuplicates,
		isFindDuplicatesOpen,
		getFindDuplicates,
	};
};
