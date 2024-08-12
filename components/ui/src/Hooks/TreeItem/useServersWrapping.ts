import { useCallback } from 'react';

import { setCurrentServer } from '../../Store/reducers/ConfiguratorSlice/configuratorSlice';
import useAppDispatch from '../Store/useAppDispatch';
import { useAppSelector } from '../Store/useAppSelector';

export default function useServersWrapping() {
	const dispatch = useAppDispatch();
	const { currentServer } = useAppSelector(
		(state) => state.configuratorReducer,
	);
	const setWrapped = useCallback(() => {
		dispatch(setCurrentServer(null));
	}, []);

	return { currentServer, setWrapped };
}
