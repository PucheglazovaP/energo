import { createStore } from 'effector';

import { fetchVersionsFx } from './effects';
import { setVersions, setVersionsIsLoading } from './events';
import { VersionsListModel } from './types';

const initState: VersionsListModel = {
	versions: [],
	isLoading: false,
};

export const $versionsList = createStore<VersionsListModel>(initState);

$versionsList.on(setVersions, (state, versions) => ({ ...state, versions }));

$versionsList.on(setVersionsIsLoading, (state, flag) => ({
	...state,
	isLoading: flag,
}));
$versionsList.watch(fetchVersionsFx.done, (state, { result }) => {
	const { versions } = result;
	setVersions(versions);
});
