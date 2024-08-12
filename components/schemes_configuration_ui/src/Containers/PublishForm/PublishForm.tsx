import { Button, Send } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { closeModal } from '../../Models/Modal/events';
import { $sidebar } from '../../Models/Sidebar';
import { publishFormFx } from '../../Models/TreeForms/effects';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';

import styles from './PublishForm.module.css';

function PublishForm() {
	const { contextMenuId } = useStore($sidebar);
	const user = useStore($user);
	const isLoading = useStore(publishFormFx.pending);

	const handleClose = () => {
		closeModal(RegisteredModals.PublishForm);
	};

	const handlePublish = () => {
		publishFormFx({
			formId: contextMenuId,
			userId: user?.preferredUsername || '',
			moduleName: ModuleName.PublishForm_publishFormFx,
		}).then(() => {
			closeModal(RegisteredModals.PublishForm);
		});
	};

	return (
		<div className={styles.body}>
			<Send className={styles.icon} />
			<h3>Публикация формы</h3>
			<p>Опубликовать все представленные группы данных и подчиненные формы?</p>
			<span className={styles.separator} />
			<div className={styles.controllers}>
				<Button
					className={styles.controllers__button}
					onClick={handleClose}
					disabled={isLoading}
				>
					Отмена
				</Button>
				<Button
					primary
					className={styles.controllers__button}
					onClick={handlePublish}
					disabled={isLoading}
				>
					Опубликовать
				</Button>
			</div>
		</div>
	);
}

export default PublishForm;
