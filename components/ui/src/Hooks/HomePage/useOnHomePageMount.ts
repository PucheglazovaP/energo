import { useEffect } from 'react';

import { COMMON_PAGE_ROW_COUNT } from '../../Const';
import { LOCAL_USER } from '../../Shared/const';
import { checkSkipAuth } from '../../Shared/Utils/utils';
import { setSupportTooltipMode } from '../../Store/reducers/AppSlice/AppSlice';
import { getUserRoles } from '../../Store/reducers/AuthSlice/authActions';
import { selectUser } from '../../Store/reducers/AuthSlice/authSelectors';
import { setUserInfo } from '../../Store/reducers/AuthSlice/AuthSlice';
import {
	fetchDeviceList,
	fetchGroupsList,
	fetchServersList,
	fetchUnusedChannelsList,
} from '../../Store/reducers/ConfiguratorSlice/configuratorActions';
import { selectCurrentServer } from '../../Store/reducers/ConfiguratorSlice/configuratorSelectors';
import {
	fetchMethods,
	fetchStorageTypes,
	fetchUnits,
} from '../../Store/reducers/PreferenceSlice/preferenceActions';
import { SortOrderMode } from '../../Store/reducers/SortSlice/types';
import { getUserGroups } from '../../Store/reducers/UserGroupsSlice/UserGroupsActions';
import useAppDispatch from '../Store/useAppDispatch';
import { useAppSelector } from '../Store/useAppSelector';

export function useOnHomePageMount(): string | undefined {
	const currentServer = useAppSelector(selectCurrentServer);
	const user = useAppSelector(selectUser);
	const dispatch = useAppDispatch();

	useEffect(() => {
		const isSupportTooltipMode = localStorage.getItem('isSupportTooltipMode');
		dispatch(setSupportTooltipMode(!(isSupportTooltipMode === 'false')));
	}, []);

	useEffect(() => {
		if (checkSkipAuth()) {
			dispatch(setUserInfo(LOCAL_USER));
		}
	}, []);

	useEffect(() => {
		if (user) {
			dispatch(getUserRoles());
			dispatch(getUserGroups());
			dispatch(fetchMethods());
			dispatch(fetchStorageTypes());
			dispatch(fetchUnits());
			dispatch(fetchServersList(user.preferredUsername));
		}
	}, [user?.preferredUsername]);

	useEffect(() => {
		if (user && currentServer) {
			dispatch(
				fetchGroupsList(
					1,
					COMMON_PAGE_ROW_COUNT,
					null,
					null,
					currentServer,
					false,
					1,
					1,
					SortOrderMode.NUMBER_FORWARD,
					user.preferredUsername,
				),
			);
			dispatch(
				fetchDeviceList(
					1,
					COMMON_PAGE_ROW_COUNT,
					null,
					currentServer,
					false,
					1,
					1,
					SortOrderMode.NUMBER_FORWARD,
					user.preferredUsername,
				),
			);
			dispatch(
				fetchUnusedChannelsList(
					currentServer,
					1,
					COMMON_PAGE_ROW_COUNT,
					false,
					SortOrderMode.NUMBER_FORWARD,
					null,
					user.preferredUsername,
				),
			);
		}
	}, [currentServer, user?.preferredUsername]);
	return user?.preferredUsername;
}
