import { useState } from 'react';
import { useStore } from 'effector-react';

import { Archive, Loader, Sum } from '../../Icons';
import { $activeForm } from '../../Models/ActiveForm';
import { $formContextMenu } from '../../Models/FormContextMenu';
import { getInfoForGroup } from '../../Models/GroupInformationModal/event';
import { openModal } from '../../Models/Modal/events';
import { Permissions } from '../../packages/KeycloakInstance/types';
import usePermissions from '../../packages/KeycloakInstance/usePermissions';
import { checkPermission } from '../../packages/KeycloakInstance/utils';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { TransparentConfiguration } from '../../Shared/Types/formObject';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import { isTransparant } from '../../Utils/guards';

import styles from './Form.module.css';

function useContextMenu() {
	const [position, setPosition] = useState<ContextMenuPosition | null>(null);
	const permissions = usePermissions();
	const { object: contextMenuObject } = useStore($formContextMenu);
	const { visdelayForm } = useStore($activeForm);

	const isArchiveDisabled = (groupId: number | null) => {
		return (
			!checkPermission(permissions, Permissions.CanViewDevicesArchive) ||
			!groupId
		);
	};

	const getTransparantItems = (
		transparant: TransparentConfiguration,
	): ContextMenuItem[] => [
		{
			name: 'Диагностика по приборам',
			isDisabled: !transparant.groupId,
			onClick: () => openModal(RegisteredModals.DeviceHealthiness),
			renderFn: () => (
				<div className={styles.context_menu_item}>
					<Loader className={styles.context_menu_icon} />
					<span>Диагностика по приборам</span>
				</div>
			),
		},
		{
			name: 'Формула группы',
			onClick: () => {
				if (contextMenuObject && contextMenuObject.groupId) {
					getInfoForGroup({
						groupNumber: contextMenuObject.groupId,
						delay: visdelayForm || contextMenuObject.visdelay,
					});
					openModal(RegisteredModals.GroupInformation);
				}
			},
			renderFn: () => (
				<div className={styles.context_menu_item}>
					<Sum className={styles.context_menu_icon} />
					<span>Формула группы</span>
				</div>
			),
			isDisabled: !transparant.groupId,
		},
		{
			name: 'Архивы приборов',
			isDisabled: isArchiveDisabled(transparant.groupId),
			onClick: () => openModal(RegisteredModals.DevicesGroupsArchive),
			renderFn: () => (
				<div className={styles.context_menu_item}>
					<Archive className={styles.context_menu_icon} />
					<span>Архивы приборов</span>
				</div>
			),
		},
	];

	const getContextMenuItems = (): ContextMenuItem[] => {
		if (isTransparant(contextMenuObject)) {
			return getTransparantItems(contextMenuObject);
		}
		return [];
	};

	return {
		position,
		setPosition,
		items: getContextMenuItems(),
	};
}

export default useContextMenu;
