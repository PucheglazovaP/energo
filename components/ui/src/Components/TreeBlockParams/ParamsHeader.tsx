import React from 'react';

import { Search } from '../Icons';

import styles from './TreeBlockParams.module.css';

interface ParamsHeaderProps {
	title: string;
	onAction(): void;
}

const ParamsHeader = (props: ParamsHeaderProps) => {
	return (
		<div className={styles.tableParams__header}>
			<div className={styles.header__title}>{props.title}</div>
			<button className={styles.search} onClick={props.onAction}>
				<Search />
				<span>Поиск номеров</span>
			</button>
		</div>
	);
};

export default ParamsHeader;
