import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import { Dot } from '../../Icons';
import { CircleDelete } from '../../Icons';
import { $activeIds } from '../../Models/ActiveIds';
import { $user } from '../../Models/Auth';
import { $editMode } from '../../Models/EditMode';
import { $formLayers } from '../../Models/FormLayers';
import {
	deleteSystemLayerFx,
	getCurrentFormLayersFx,
	getSystemLayerFormsFx,
	getSystemLayersFx,
} from '../../Models/FormLayers/effects';
import { closeModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { SystemLayerForms } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import Checkbox from '../../UI/Checkbox';
import Spinner from '../../UI/Spinner';

import styles from './ConfirmSystemLayerDeletion.module.css';

function ConfirmSystemLayerDeletion() {
	const user = useStore($user);
	const activeIds = useStore($activeIds);
	const { editData } = useStore($formLayers);
	const { id: formId } = useStore($editMode);

	const isLoading = useStore(getSystemLayerFormsFx.pending);
	const [isUserConfirmedDeletion, setConfirmFlag] = useState(false);
	const [systemLayerFormList, setSystemLayerFormList] = useState<
		SystemLayerForms[]
	>([]);

	const onCancel = () => {
		closeModal(RegisteredModals.ConfirmSystemLayerDeletion);
	};

	const onAccept = async () => {
		if (!user) {
			return null;
		}
		await deleteSystemLayerFx({
			userId: user.preferredUsername,
			layerId: editData?.id || 0,
			lastModified: editData?.lastModified || '',
			moduleName: ModuleName.ConfirmSystemLayerDeletion_deleteFormFx,
		}).then(() => {
			closeModal(RegisteredModals.ConfirmSystemLayerDeletion);
			toast.success(`Слой ${editData?.name || ''} удален`);
		});
		await getSystemLayersFx({
			userId: user.preferredUsername,
			systemCode: activeIds.activeVersion?.systemCode || 0,
			moduleName: ModuleName.ConfirmSystemLayerDeletion_getSystemLayersFx,
		});
		await getCurrentFormLayersFx({
			userId: user.preferredUsername,
			formId: formId || 0,
			moduleName: ModuleName.ConfirmSystemLayerDeletion_getCurrentFormLayersFx,
		});
	};

	useEffect(() => {
		if (user)
			getSystemLayerFormsFx({
				userId: user.preferredUsername,
				layerId: editData?.id || 0,
				moduleName:
					ModuleName.ConfirmSystemLayerDeletion_getCurrentFormLayersFx,
			}).then((systemLayerFormList) =>
				setSystemLayerFormList(systemLayerFormList),
			);
	}, []);

	return (
		<div className={styles.form}>
			<CircleDelete className={styles.icon} />
			<span className={styles.heading}>Удаление</span>
			<span className={styles.title}>
				Слой {editData?.name || ''} будет удален из системы. Все привязанные к
				нему объекты в других формах перейдут на основной слой
			</span>
			<span className={styles.text}>
				К слою привязаны объекты следующих форм:
			</span>
			{isLoading ? (
				<div className={styles.spinner}>
					<Spinner className={styles.loading} />
				</div>
			) : (
				<ul className={styles.form_list}>
					{systemLayerFormList.map((item) => (
						<li key={item.id} className={styles.list_item}>
							<Dot className={styles.dot} />
							{item.name} (кол-во объектов {item.objectsCount} шт.)
						</li>
					))}
				</ul>
			)}
			<span className={styles.separator} />
			<Checkbox
				name={'accept_deleting_layer'}
				checked={isUserConfirmedDeletion}
				title={'Да, я подтверждаю удаление слоя из системы'}
				onChange={() => {
					setConfirmFlag(!isUserConfirmedDeletion);
				}}
				className={styles.checkbox}
			/>
			<div className={styles.controllers}>
				<Button onClick={onCancel} className={styles.button}>
					Отмена
				</Button>
				<Button
					primary
					onClick={onAccept}
					disabled={!isUserConfirmedDeletion}
					className={styles.button}
				>
					Удалить
				</Button>
			</div>
		</div>
	);
}

export default ConfirmSystemLayerDeletion;
