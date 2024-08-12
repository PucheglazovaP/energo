import { useEffect, useState } from 'react';
import { Button } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import { formulaFromDBAdapter } from '../../Adapters/groupInformationAdapter';
import { getFormulaListQuery } from '../../Const/Queries/formula';
import { Close } from '../../Icons';
import NotificationIcon from '../../Icons/Notification';
import { $groupInformationModal } from '../../Models/GroupInformationModal';
import { setGroupFormulaModalOpen } from '../../Models/GroupInformationModal/event';
import FormulaViewer from '../../UI/FormulaEditor';
import Spinner from '../../UI/Spinner';
import { rpcQuery } from '../../Utils/requests';

import styles from './GroupInformation.module.css';

function GroupFormulaModal() {
	const {
		modalInfo: { groupId, groupName },
	} = useStore($groupInformationModal);

	const [formula, setFormulaList] = useState<string>('');
	const [isLoading, setLoadingStatus] = useState<boolean>(true);

	useEffect(() => {
		if (groupId) {
			rpcQuery<string>(getFormulaListQuery(groupId), formulaFromDBAdapter)
				.then((formula) => {
					setLoadingStatus(false);
					setFormulaList(formula);
				})
				.catch(() => setLoadingStatus(false));
		}
	}, [groupId]);

	return (
		<>
			<div className={styles.modal}>
				<div className={styles.modal_window}>
					<div className={styles.modal_title_section}>
						{' '}
						<h3 className={styles.modal_title}>
							{groupId} Формула / {groupName}
						</h3>
						<Button
							onClick={() => {
								setGroupFormulaModalOpen(false);
							}}
							className={styles.close_btn}
						>
							<Close className={styles.icon} />
						</Button>
					</div>
					{isLoading ? (
						<div className={styles.spinner}>
							<Spinner className={styles.loading} />
						</div>
					) : (
						<>
							{formula ? (
								<FormulaViewer formula={formula} className={styles.formula} />
							) : (
								<div className={styles.no_info}>
									<NotificationIcon className={styles.notification_icon} />
									<p>Для этой группы не назначена формула</p>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</>
	);
}

export default GroupFormulaModal;
