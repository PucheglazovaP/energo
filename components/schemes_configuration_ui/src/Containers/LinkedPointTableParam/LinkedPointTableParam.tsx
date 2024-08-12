import { Button } from '@evraz/ui-kit';

import { Close } from '../../Icons';
import Edit from '../../Icons/Edit';
import Divider from '../../UI/Divider';
import Table from '../../UI/Table';

import { LinkedPointTableParamProps } from './types';

import styles from './LinkedPointTableParam.module.css';

function LinkedPointTableParam({
	data,
	header,
	handleEditLinkedPoint,
	handleUnbindPoint,
	isUpdateMode,
	isUnbindMode,
}: LinkedPointTableParamProps) {
	return (
		<section className={styles.linked_points}>
			<div className={styles.linked_points_header}>
				<h4>
					<span>Связанная точка учета</span>
					<span className={styles.required_marker}>*</span>
				</h4>
				{!isUpdateMode && (
					<>
						<Divider />
						<Button
							className={styles.header_button}
							onClick={handleEditLinkedPoint}
						>
							<Edit className={styles.icon_edit} />
							Редактировать
						</Button>
					</>
				)}
				{isUnbindMode && (
					<Button className={styles.header_button} onClick={handleUnbindPoint}>
						<Close className={styles.icon_cross} /> Отвязать
					</Button>
				)}
			</div>
			{data.length > 0 && (
				<Table
					className={styles.linked_points_table}
					headers={header}
					data={data}
				/>
			)}
		</section>
	);
}

export default LinkedPointTableParam;
