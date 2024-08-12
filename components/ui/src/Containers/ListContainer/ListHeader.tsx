import React from 'react';
import clsx from 'clsx';

import { REVERSE_TREE } from '../../Const';
import { useSortTree } from '../../Hooks/ConfiguratorTree/useSortTree';
import useServersWrapping from '../../Hooks/TreeItem/useServersWrapping';
import Sort from '../../Icons/Sort';
import { SortOrderMode } from '../../Store/reducers/SortSlice/types';

import { ListHeaderProps } from './types';
import styles from './ListContainer.module.scss';

function ListHeader({ uncover, count, unused, treeType }: ListHeaderProps) {
	const { currentServer, setWrapped } = useServersWrapping();
	const { setSortOrderMode, sortOrder, isFirstSortModeActive } =
		useSortTree(treeType);

	return (
		<div
			className={clsx(styles.listHeader, unused && styles.listHeader__unused)}
		>
			<div
				className={
					unused
						? clsx(styles.listHeader__item, styles.listUnused)
						: clsx(
								styles.listHeader__item,
								treeType === REVERSE_TREE &&
									styles.listHeader__deviceNumberItem,
						  )
				}
			>
				{uncover && (
					<button
						type="button"
						className={
							currentServer
								? styles.listBtn
								: clsx(styles.listBtn, styles.listBtn__hide)
						}
						onClick={setWrapped}
					/>
				)}
				<div className={styles.list__sort}>
					<div>Номер</div>
					<button
						className={styles.list__button}
						onClick={setSortOrderMode(
							!isFirstSortModeActive
								? SortOrderMode.NUMBER_FORWARD
								: sortOrder === SortOrderMode.NUMBER_FORWARD
								? SortOrderMode.NUMBER_REVERSE
								: SortOrderMode.NUMBER_FORWARD,
						)}
					>
						{isFirstSortModeActive &&
						(sortOrder === SortOrderMode.NUMBER_FORWARD ||
							sortOrder === SortOrderMode.NUMBER_REVERSE) ? (
							<Sort
								className={clsx(
									styles.sortButton,
									sortOrder === SortOrderMode.NUMBER_REVERSE &&
										styles.sortButton__reverse,
								)}
							/>
						) : (
							<Sort className={styles.sortButton__default} />
						)}
					</button>
				</div>
			</div>
			<div
				className={
					unused
						? clsx(styles.listHeader__item, styles.listUnused)
						: styles.listHeader__item
				}
			>
				<div className={styles.list__sort}>
					<div>Наименование</div>
					<button
						className={styles.list__button}
						onClick={setSortOrderMode(
							sortOrder === SortOrderMode.NAME_FORWARD
								? SortOrderMode.NAME_REVERSE
								: SortOrderMode.NAME_FORWARD,
						)}
					>
						<Sort
							className={clsx(
								styles.sortButton,
								sortOrder,
								sortOrder !== SortOrderMode.NAME_REVERSE &&
									sortOrder !== SortOrderMode.NAME_FORWARD &&
									styles.sortButton__default,
								sortOrder === SortOrderMode.NAME_REVERSE &&
									styles.sortButton__reverse,
							)}
						/>
					</button>
				</div>
			</div>
			{count && (
				<div className={styles.listHeader__item}>
					<div className={styles.list__sort}>
						<div>Кол-во</div>
						<button
							className={styles.list__button}
							onClick={setSortOrderMode(
								sortOrder === SortOrderMode.COUNT_FORWARD
									? SortOrderMode.COUNT_REVERSE
									: SortOrderMode.COUNT_FORWARD,
							)}
						>
							<Sort
								className={clsx(
									styles.sortButton,
									sortOrder,
									sortOrder !== SortOrderMode.COUNT_REVERSE &&
										sortOrder !== SortOrderMode.COUNT_FORWARD &&
										styles.sortButton__default,
									sortOrder === SortOrderMode.COUNT_REVERSE &&
										styles.sortButton__reverse,
								)}
							/>
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default ListHeader;
