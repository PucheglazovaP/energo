import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { PositionAxis } from '../../Shared/types';
import Divider from '../../UI/Divider';

import useChangeChannelNSI from './useChangeChannelNSI';

import styles from './ModalChangeChannelNSI.module.css';

function ModalChangeChannelNSI() {
	const {
		currentNodeTitle,
		newNodeTitle,
		currentNodeName,
		newNodesElement,
		checkboxTitle,
		equipmentPieceTitle,
		isConfirmButtonDisabled,
		handleClose,
		handleConfirm,
	} = useChangeChannelNSI();

	return (
		<div className={clsx(styles.root)}>
			<div className={styles.nodes_block}>
				<div className={styles.field_wrapper}>
					<div className={styles.field_label}>{currentNodeTitle}</div>
					<div className={styles.field_value}>{currentNodeName}</div>
				</div>
				<div className={styles.field_wrapper}>
					<div className={styles.field_label}>{newNodeTitle}</div>
					{newNodesElement}
				</div>
			</div>
			<Divider className={styles.divider} position={PositionAxis.Horizontal} />
			<div className={styles.checkbox_block}>
				<div className={styles.field_label}>{checkboxTitle}</div>
				<div className={styles.field_value}>{equipmentPieceTitle}</div>
			</div>

			<Divider className={styles.divider} position={PositionAxis.Horizontal} />
			<div className={styles.buttons_row}>
				<Button className={styles.button} onClick={handleClose}>
					Отменить
				</Button>
				<Button
					className={styles.button}
					onClick={handleConfirm}
					primary
					disabled={isConfirmButtonDisabled}
				>
					Подтвердить
				</Button>
			</div>
		</div>
	);
}

export default ModalChangeChannelNSI;
