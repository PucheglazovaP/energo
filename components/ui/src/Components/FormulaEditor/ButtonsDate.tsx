import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { PreferenceType } from '../../Types/PreferenceTypes';
import ParamsItem from '../TreeBlockParams/ParamsItem';

import { useButtonsDate } from './utils/useButtonsDate';
import { argumentItems, dateItems } from './data';
import {
	ButtonsBooleansProps,
	DataTab,
	DataTabsElem,
	DateArgumentItem,
} from './types';

import styles from './FormulaEditor.module.css';

function ButtonsDate({ className, style, onClick }: ButtonsBooleansProps) {
	const { setActiveTabHandler, activeTab, onClickHandler } = useButtonsDate({
		onClick,
	});
	return (
		<div className={clsx(className)} style={style}>
			<div className={styles.data_tabs}>
				<button
					className={clsx(
						styles.tab_button,
						activeTab === DataTab.Argument && styles.tab_button__active,
					)}
					onClick={setActiveTabHandler(DataTab.Argument)}
					tabIndex={-1}
				>
					Аргумент
				</button>
				<button
					className={clsx(
						styles.tab_button,
						activeTab === DataTab.Data && styles.tab_button__active,
					)}
					onClick={setActiveTabHandler(DataTab.Data)}
					tabIndex={-1}
				>
					Дата
				</button>
			</div>
			<div className={styles.data_items}>
				{(activeTab === DataTab.Data ? dateItems : argumentItems).map(
					(item, index) => {
						if (item.type === DateArgumentItem.Input)
							return (
								<ParamsItem
									value={item.value}
									placeholder={item.placeholder}
									key={`${item.placeholder}_${index}`}
									needRenderAddButton={item.needRenderAddButton}
									onAddClick={onClickHandler(item.placeholder as DataTabsElem)}
									options={item.options as PreferenceType[]}
									dropdown={item.dropdown}
									className={styles.params_input_container}
								/>
							);
						if (item.type === DateArgumentItem.Calendar)
							return (
								<ParamsItem
									value={item.value}
									placeholder={item.placeholder}
									key={`${item.placeholder}_${index}`}
									needRenderAddButton={item.needRenderAddButton}
									onAddClick={onClickHandler(
										item.placeholder as DataTabsElem,
										DateArgumentItem.Calendar,
									)}
									isCalendar={true}
									className={styles.params_input_container}
								/>
							);
						if (item.type === DateArgumentItem.Button)
							return (
								<Button
									value={item.value}
									placeholder={item.placeholder}
									key={`${item.placeholder}_${index}`}
									onClick={onClickHandler(item.placeholder as DataTabsElem)('')}
									className={styles.numpad_button}
									tabIndex={-1}
								>
									{item.placeholder}
								</Button>
							);
					},
				)}
			</div>
		</div>
	);
}

export default ButtonsDate;
