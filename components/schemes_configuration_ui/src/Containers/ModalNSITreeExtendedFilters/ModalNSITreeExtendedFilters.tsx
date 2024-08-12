import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import Spinner from '../../UI/Spinner';
import Tree from '../../UI/Tree';

import useExtendedFilters from './useExtendedFilters';

import styles from './ModalNSITreeExtendedFilters.module.css';

function ModalNSITreeExtendedFilters() {
	const {
		tree,
		isLoading,
		handleNodeClick,
		handleNodeToggle,
		handleClose,
		handleConfirm,
	} = useExtendedFilters();

	return (
		<div className={clsx(styles.root)}>
			{isLoading ? (
				<Spinner />
			) : (
				<Tree
					treeData={tree}
					isExpandable
					onExpand={handleNodeToggle}
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

export default ModalNSITreeExtendedFilters;
