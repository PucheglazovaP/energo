import React from 'react';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { Close } from '../../Icons';
import Edit from '../../Icons/Edit';
import Divider from '../../UI/Divider';
import Table from '../../UI/Table';

import { VisualizationGroupParamProps } from './types';

import styles from './VisualizationGroupParam.module.css';

function VisualizationGroupParam({
	data,
	header,
	handleEditVisualizationGroup,
	handleUnbindVisualizationGroup,
}: VisualizationGroupParamProps) {
	return (
		<section className={styles.visualization_group_container}>
			<div className={styles.visualization_group_header}>
				<h4>Группа визуализации</h4>
				<Divider />
				<Button
					className={styles.header_button}
					onClick={handleEditVisualizationGroup}
				>
					<Edit className={styles.icon_edit} />
					Редактировать
				</Button>
				<Button
					className={styles.header_button}
					onClick={handleUnbindVisualizationGroup}
				>
					<Close className={styles.icon_cross} /> Отвязать
				</Button>
			</div>
			{data.length > 0 && (
				<Table
					className={clsx(
						styles.visualization_groups_table,
						styles.footer_height,
					)}
					headers={header}
					data={data}
				/>
			)}
		</section>
	);
}

export default VisualizationGroupParam;
