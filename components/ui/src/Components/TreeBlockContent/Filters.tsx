import React, { FC } from 'react';
import { Tooltip, TooltipDirection } from '@evraz/ui-kit';
import clsx from 'clsx';

import { useConfiguratorFilters } from '../../Hooks/ConfiguratorFilters/useConfiguratorFilters';
import { TreeType } from '../../Types';

import styles from './TreeBlock.module.scss';

interface FiltersProps {
	filters: String[];
	treeType: TreeType;
}

const Filters: FC<FiltersProps> = ({ filters, treeType }) => {
	const {
		handleSearchStringChange,
		radioButtonClickHandler,
		currentSearchValue,
		filterMode,
		inputTooltip,
	} = useConfiguratorFilters(treeType);

	return (
		<div className={styles.filters}>
			<div className={styles.inputs}>
				<Tooltip
					tooltip={inputTooltip}
					disabled={!inputTooltip}
					forceDirection={TooltipDirection.Down}
				>
					<div>
						<input
							placeholder="Поиск"
							className={styles.input}
							value={currentSearchValue}
							onChange={handleSearchStringChange}
						/>
					</div>
				</Tooltip>
			</div>
			<div className={styles.radioButtons}>
				{filters.map((el, index) => (
					<button
						className={styles.buttonsGroup}
						key={`${el}_${index}`}
						onClick={radioButtonClickHandler(index)}
					>
						<p
							className={
								filterMode - 1 === index
									? clsx(styles.radioLogo, styles.active)
									: styles.radioLogo
							}
						/>
						<div className={styles.radioButtons__text}>{el}</div>
					</button>
				))}
			</div>
		</div>
	);
};

export default Filters;
