import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import Table from '../../UI/Table';

import useLinkedParameter from './useLinkedParameter';

import styles from './LinkedParameterTable.module.css';

function LinkedParameter() {
	const {
		linkedParameterData,
		header,
		isLoading,
		sections,
		handleExpandCollapseSection,
		onCancel,
		onConfirm,
	} = useLinkedParameter();

	return (
		<div className={styles.linked_parameter}>
			<Table
				headers={header}
				data={linkedParameterData}
				sections={sections}
				handleExpandCollapse={handleExpandCollapseSection}
				className={clsx(styles.linked_parameter_table, styles.footer_height)}
				isLoading={isLoading}
			/>
			<div className={styles.bottom_buttons}>
				<Button onClick={onCancel}>Отменить</Button>
				<Button onClick={onConfirm} primary>
					Применить
				</Button>
			</div>
		</div>
	);
}

export default LinkedParameter;
