import { ChangeEvent, useCallback, useState } from 'react';
import clsx from 'clsx';

import { UnitsTreeItem } from '../../Types/UnitsTreeTypes';
import ModalIcon from '../../UI/Modals/ModalIcon';
import Tree from '../Tree/Tree';

import { FormRelationsProps } from './types';

import styles from './UnitsForm.module.css';

function UnitsForm({ className, style, onConfirm }: FormRelationsProps) {
	const [searchedText, setSearchedText] = useState('');

	const selectItemHandler = useCallback(
		(id: number) => {
			onConfirm(id);
		},
		[onConfirm],
	);

	const searchHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setSearchedText(e.target.value);
	}, []);

	const filterTree = useCallback(
		(screenTree: UnitsTreeItem[]) => {
			if (searchedText === '') return screenTree;
			const filteredTree = screenTree.filter(({ displayName }) => {
				const searchMask: RegExp = new RegExp(`${searchedText}`, 'gi');

				return searchMask.test(displayName);
			});

			return filteredTree.map((treeItem) => ({
				...treeItem,
				parentId: undefined,
			}));
		},
		[searchedText],
	);

	return (
		<div className={clsx(styles.root, className)} style={style}>
			<div className={clsx(styles.search)}>
				<div className={clsx(styles.search_input)}>
					<input
						value={searchedText}
						type="text"
						placeholder="Наименование ед. изм."
						onChange={searchHandler}
					/>
					<ModalIcon />
				</div>
			</div>
			<div className={clsx(styles.body)}>
				<Tree searchItems={filterTree} onItemClick={selectItemHandler} />
			</div>
		</div>
	);
}

export default UnitsForm;
