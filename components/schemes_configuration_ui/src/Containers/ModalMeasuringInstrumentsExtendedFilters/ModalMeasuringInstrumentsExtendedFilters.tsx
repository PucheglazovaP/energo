import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import Spinner from '../../UI/Spinner';
import Tree from '../../UI/Tree';

import useMeasuringInstrumentsExtendedFilters from './useMeasuringInstrumentsExtendedFilters';

import styles from './ModalMeasuringInstrumentsExtendedFilters.module.css';

function ModalMeasuringInstrumentsExtendedFilters() {
	const {
		treeData,
		isTreeLoading,
		handleNodeExpand,
		handleNodeClick,
		handleClose,
		handleConfirm,
	} = useMeasuringInstrumentsExtendedFilters();

	return (
		<div className={clsx(styles.root)}>
			{isTreeLoading ? (
				<Spinner />
			) : (
				<Tree
					treeData={treeData}
					isExpandable
					onExpand={handleNodeExpand}
					onItemClick={handleNodeClick}
					className={styles.tree}
				/>
			)}
			<div className={styles.buttons_row}>
				<Button className={styles.button} onClick={handleClose}>
					Сбросить
				</Button>
				<Button className={styles.button} primary onClick={handleConfirm}>
					Применить
				</Button>
			</div>
		</div>
	);
}

export default ModalMeasuringInstrumentsExtendedFilters;
