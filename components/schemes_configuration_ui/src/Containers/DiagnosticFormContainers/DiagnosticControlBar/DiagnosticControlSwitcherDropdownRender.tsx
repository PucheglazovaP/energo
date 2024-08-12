import clsx from 'clsx';
import { useStore } from 'effector-react';

import $diagnosticCurrentModel from '../../../Models/DiagnosticCurrent';
import { setSelectedServerIdEvent } from '../../../Models/DiagnosticCurrent/events';
import Select from '../../../UI/Select';
import { SelectOption } from '../../../UI/Select/types';

import { SwitcherItemRenderFn } from './types';
import { getSelectorServers } from './utils';

import styles from './DiagnosticControlBar.module.css';

function DiagnosticControlSwitcherDropdownRender() {
	return function Render({ id, isSelected, onSelect }: SwitcherItemRenderFn) {
		const { servers, selectedServerId } = useStore($diagnosticCurrentModel);
		const selectorServers = getSelectorServers(servers, selectedServerId);

		const handleSwitcherSelect = () => {
			onSelect(id);
		};

		const handleServerSelect = (options: SelectOption[]) => {
			const selectedOption = options.find((item) => item.isSelected);

			if (selectedOption) {
				setSelectedServerIdEvent(selectedOption.value.toString());
			}
		};

		return (
			<div className={styles.switcher_dropdown_container}>
				{!isSelected && (
					<button
						className={styles.switcher_dropdown_handler}
						onClick={handleSwitcherSelect}
					/>
				)}
				<Select
					className={clsx(styles.switcher_dropdown, {
						[styles.switcher_dropdown__active]: isSelected,
					})}
					options={selectorServers}
					onSelect={handleServerSelect}
				></Select>
			</div>
		);
	};
}

export default DiagnosticControlSwitcherDropdownRender;
