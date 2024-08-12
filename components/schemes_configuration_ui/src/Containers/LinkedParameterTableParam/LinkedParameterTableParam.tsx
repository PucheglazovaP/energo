import React from 'react';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { Close } from '../../Icons';
import Edit from '../../Icons/Edit';
import Divider from '../../UI/Divider';
import Table from '../../UI/Table';

import { LinkedParameterTableParamProps } from './types';

import styles from './LinkedParameterTableParam.module.css';

function LinkedParameterTableParam({
	data,
	header,
	handleEditLinkedParameter,
	handleUnbindParameter,
}: LinkedParameterTableParamProps) {
	return (
		<section className={styles.linked_parameter}>
			<div className={styles.linked_parameter_header}>
				<h4>Связанный параметер</h4>
				<Divider />
				<Button
					className={styles.header_button}
					onClick={handleEditLinkedParameter}
				>
					<Edit className={styles.icon_edit} />
					Редактировать
				</Button>
				<Button
					className={styles.header_button}
					onClick={handleUnbindParameter}
				>
					<Close className={styles.icon_cross} /> Отвязать
				</Button>
			</div>
			{data.length > 0 && (
				<Table
					className={clsx(styles.linked_parameter_table, styles.footer_height)}
					headers={header}
					data={data}
				/>
			)}
		</section>
	);
}

export default LinkedParameterTableParam;
