import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import { CircleDelete } from '../../Icons';
import { $activeChart } from '../../Models/ActiveChart';
import { $activeForm } from '../../Models/ActiveForm';
import { $activeIds } from '../../Models/ActiveIds';
import { $user } from '../../Models/Auth';
import { closeModal } from '../../Models/Modal/events';
import { $sidebar } from '../../Models/Sidebar';
import { $treeForms } from '../../Models/TreeForms';
import { deleteFormFx } from '../../Models/TreeForms/effects';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';

import styles from './ConfirmFormDeletion.module.css';

function ConfirmFormDeletion() {
	const { contextMenuId } = useStore($sidebar);
	const tree = useStore($treeForms);
	const { activeVersion } = useStore($activeIds);
	const { isLoading } = useStore($activeForm);
	const { isLoading: isChartLoading } = useStore($activeChart);
	const user = useStore($user);

	const onCancel = useCallback(() => {
		closeModal(RegisteredModals.ConfirmFormDeletion);
	}, []);

	const formName =
		tree.find((item) => item.id === contextMenuId)?.displayName || '';

	const onAccept = useCallback(() => {
		if (!user) {
			return null;
		}
		deleteFormFx({
			id: contextMenuId,
			versionCode: activeVersion?.code || 0,
			userId: user.preferredUsername,
			moduleName: ModuleName.ConfirmFormDeletion_deleteFormFx,
		})
			.then(() => {
				closeModal(RegisteredModals.ConfirmFormDeletion);
				toast.success(`Форма ${formName} удалена`);
			})
			.catch(() => toast.warn('Не удалось удалить форму'));
	}, []);

	return (
		<div className={styles.form}>
			<CircleDelete className={styles.icon} />
			<span className={styles.heading}>Удаление</span>
			<span className={styles.title}>
				Вы действительно хотите удалить форму {formName}?
			</span>
			<span className={styles.separator} />
			<div className={styles.controllers}>
				<Button
					onClick={onCancel}
					className={styles.button}
					disabled={isLoading}
				>
					Отмена
				</Button>
				<Button
					primary
					onClick={onAccept}
					className={styles.button}
					disabled={isLoading && isChartLoading}
				>
					Удалить
				</Button>
			</div>
		</div>
	);
}

export default ConfirmFormDeletion;
