import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { PositionAxis } from '../../Shared/types';
import Divider from '../../UI/Divider';
import Table from '../../UI/Table';
import WarningMessage from '../../UI/WarningMessage';

import useLinkMeasuringInstrumentsNSI from './useLinkMeasuringInstrumentsNSI';

import styles from './ModalLinkMeasuringInstrumentsNSI.module.css';

function ModalLinkMeasuringInstrumentsNSI() {
	const {
		currentDeviceName,
		isDeviceEmpty,
		isWarningShown,
		isConfirmButtonDisabled,
		header,
		data,
		deviceChildren,
		handleClose,
		handleConfirm,
	} = useLinkMeasuringInstrumentsNSI();

	return (
		<div className={clsx(styles.root)}>
			<div className={styles.info_row}>
				<div className={styles.left_col}>
					<div className={styles.title}>{currentDeviceName}</div>
					{isDeviceEmpty ? (
						<WarningMessage text="В данном приборе нет узлов учета" />
					) : (
						deviceChildren
					)}
				</div>
				<Divider position={PositionAxis.Vertical} className={styles.divider} />
				<div className={styles.right_col}>
					<div className={styles.title}>Список для привязки</div>
					{isWarningShown && (
						<WarningMessage text="К каналу может быть привязана только одна единица оборудования. Удалите лишние единицы из списка ниже" />
					)}
					<Table headers={header} data={data} className={styles.table} />
				</div>
			</div>
			<Divider
				position={PositionAxis.Horizontal}
				className={styles.divider_horizontal}
			/>
			<div className={styles.buttons_row}>
				<Button className={styles.button} onClick={handleClose}>
					Отменить
				</Button>
				<Button
					className={styles.button}
					primary
					onClick={handleConfirm}
					disabled={isConfirmButtonDisabled}
				>
					Подтвердить
				</Button>
			</div>
		</div>
	);
}

export default ModalLinkMeasuringInstrumentsNSI;
