import { useEffect } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { $searchInfo } from '../../Models/HardwareGroup';
import { fetchGroupListFx } from '../../Models/HardwareGroup/effects';
import { resetGroupsState } from '../../Models/HardwareGroup/event';

export function useMount() {
	const user = useStore($user);
	const { value, filterMode } = useStore($searchInfo);
	useEffect(() => {
		if (!user) return;
		const searchValue = filterMode == 2 ? `%${value}%` : value;
		fetchGroupListFx({
			pageNumber: 0,
			pageRowCount: 30,
			filterStr: searchValue,
			fkChannel: null,
			serverId: 2,
			filterMode: filterMode,
			orderMode: 1,
			mode: 1,
			userId: user.preferredUsername,
		});
		return () => {
			resetGroupsState();
		};
	}, []);
}
