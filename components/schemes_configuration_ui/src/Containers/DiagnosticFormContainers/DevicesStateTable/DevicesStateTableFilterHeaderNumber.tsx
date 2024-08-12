import clsx from 'clsx';
import { useStore } from 'effector-react';

import Filter from '../../../Icons/Filter';
import $diagnosticCurrentModel from '../../../Models/DiagnosticCurrent';
import { setFilterExpressionEvent } from '../../../Models/DiagnosticCurrent/events';
import MultiselectDropdown from '../../../UI/MultiselectDropdown';

import DevicesStateTableFilterHeaderNumberTooltip from './DevicesStateTableFilterHeaderNumberTooltip';
import { DevicesStateTableFilterHeaderNumberProps } from './types';

import styles from './DevicesStateTable.module.css';

function DevicesStateTableFilterHeaderNumber({
	title,
	expressionFieldName,
	onApply,
}: DevicesStateTableFilterHeaderNumberProps) {
	return function Render() {
		const diagnosticCurrentModel = useStore($diagnosticCurrentModel);
		const isFilterActive = diagnosticCurrentModel[expressionFieldName];
		const iconClass = clsx(styles.filter_icon, {
			[styles.filter_icon__active]: isFilterActive,
		});

		const handleExpressionChange = (expressionValue: string) => {
			setFilterExpressionEvent({ expressionFieldName, expressionValue });
		};

		return (
			<MultiselectDropdown
				title={title}
				className={styles.filter_header}
				rightIcon={<Filter className={iconClass} />}
				isSearchBoxVisible
				onApply={onApply}
				tooltipBody={<DevicesStateTableFilterHeaderNumberTooltip />}
				onSearch={handleExpressionChange}
				searchFieldPattern="^(?:[<>](?:\d{1,3})?|\d{1,3})$"
			/>
		);
	};
}

export default DevicesStateTableFilterHeaderNumber;
