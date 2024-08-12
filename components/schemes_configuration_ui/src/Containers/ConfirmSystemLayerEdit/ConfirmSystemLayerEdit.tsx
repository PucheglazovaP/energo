import { Button } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import CircleInfo from '../../Icons/CircleInfo';
import { $activeIds } from '../../Models/ActiveIds';
import { $user } from '../../Models/Auth';
import { $formLayers } from '../../Models/FormLayers';
import {
	editSystemLayerFx,
	getSystemLayersFx,
} from '../../Models/FormLayers/effects';
import { setSystemLayerEditData } from '../../Models/FormLayers/events';
import { closeModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';

import styles from './ConfirmSystemLayerEdit.module.css';

function ConfirmSystemLayerEdit() {
	const user = useStore($user);
	const activeIds = useStore($activeIds);
	const { editData } = useStore($formLayers);

	const onCancel = () => {
		setSystemLayerEditData(null);
		closeModal(RegisteredModals.ConfirmSystemLayerEdit);
	};

	const onAccept = async () => {
		if (!user) {
			return null;
		}
		await editSystemLayerFx({
			layerName: editData?.name || '',
			comment: editData?.comment || '',
			layerId: editData?.id || 0,
			lastModified: editData?.lastModified || '',
			userId: user.preferredUsername,
			moduleName: ModuleName.ConfirmSystemLayerEdit_editSystemLayerFx,
		});
		await getSystemLayersFx({
			userId: user.preferredUsername,
			systemCode: activeIds.activeVersion?.systemCode || 0,
			moduleName: ModuleName.ConfirmSystemLayerEdit_getSystemLayersFx,
		});
		setSystemLayerEditData(null);
		closeModal(RegisteredModals.ConfirmSystemLayerEdit);
	};

	return (
		<div className={styles.form}>
			<CircleInfo width={40} height={40} className={styles.icon} />
			<span className={styles.heading}>Сохранить изменения</span>
			<span className={styles.title}>
				Изменения, которые были внесены отобразятся на всех формах мониторинга
			</span>
			<span className={styles.separator} />
			<div className={styles.controllers}>
				<Button onClick={onCancel} className={styles.button}>
					Отмена
				</Button>
				<Button primary onClick={onAccept} className={styles.button}>
					Ок
				</Button>
			</div>
		</div>
	);
}

export default ConfirmSystemLayerEdit;
