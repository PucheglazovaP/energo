import { combine } from 'effector';

import { $formContextMenu } from '../FormContextMenu';
import { $formSettings } from '../FormSettings';
import { $navigation } from '../Navigation';
import { $versionsList } from '../VersionSelector';

import { ActiveVersionIdsModel } from './types';

export const $activeIds = combine(
	$formContextMenu,
	$navigation,
	$versionsList,
	$formSettings,
	(
		formContextMenu,
		navigation,
		versionsList,
		formSettings,
	): ActiveVersionIdsModel => {
		return {
			activeVersionId: navigation.versionId,
			activeVersion: versionsList.versions.find(
				(version) => version.code === navigation.versionId,
			),
			formContextMenuId: formContextMenu.object?.id || null,
			formId: formSettings.activeId,
		};
	},
);
