import React, { ChangeEvent } from 'react';
import { AngleDown } from '@evraz/ui-kit';
import clsx from 'clsx';

import { Search } from '../../../Icons';
import Input from '../../../UI/Input';

import styles from '../ReportItemsList.module.css';

function ItemsHeader({
	pointName,
	positionName,
	handlePointName = () => {},
	handlePositionName = () => {},
	handleCloseItems = () => {},
}: {
	pointName: string;
	positionName: string;
	handlePositionName: (text: ChangeEvent<HTMLInputElement>) => void;
	handlePointName: (text: ChangeEvent<HTMLInputElement>) => void;
	handleCloseItems: () => void;
}) {
	return (
		<div className={styles.header}>
			<button className={styles.btn} onClick={handleCloseItems}>
				<AngleDown className={clsx(styles.arrow)} />
			</button>
			<Input
				type="search"
				isSearch
				placeholder="Наименование"
				value={positionName}
				onChange={handlePositionName}
				className={clsx(styles.search, styles.search_name)}
				glyph={<Search className={styles.search_icon} />}
			/>
			<span>Вычисляемое</span>
			<Input
				type="search"
				isSearch
				placeholder="Базовая ТУ"
				value={pointName}
				onChange={handlePointName}
				className={clsx(styles.search, styles.search_point)}
				glyph={<Search className={styles.search_icon} />}
			/>
			<span className={styles.coefficient}>Коэфф.</span>
		</div>
	);
}

export default ItemsHeader;
