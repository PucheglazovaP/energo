import React from 'react';
import { Button } from '@evraz/ui-kit';

import { useSubmitOperation } from '../../Hooks/useSubmitOperation';
import Modal from '../Modal';

import { SubmitOperationHeader } from './types';
import styles from './SubmitOperation.module.scss';

function renderHeader({ title, body }: SubmitOperationHeader): JSX.Element {
	return (
		<div className={styles.header}>
			<span>{title}</span>
			{body}
		</div>
	);
}
function SubmitOperation() {
	const {
		closeSubmitOperation,
		submitOperationTitle,
		submitOperationBody,
		submitFunction,
		submitButtonText,
	} = useSubmitOperation();

	return (
		<Modal
			title={renderHeader({
				title: String(submitOperationTitle),
				body: submitOperationBody,
			})}
			onClose={closeSubmitOperation}
			className={styles.modal}
			withClose={false}
		>
			<div className={styles.buttons}>
				<Button onClick={closeSubmitOperation}>Отмена</Button>
				<Button className={styles.submit_button} onClick={submitFunction}>
					{submitButtonText}
				</Button>
			</div>
		</Modal>
	);
}

export default SubmitOperation;
