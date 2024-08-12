import React from 'react';
import { Button, Calendar } from '@evraz/ui-kit';
import clsx from 'clsx';

import CloseIcon from '../../Components/Icons/Close';
import { useParamsItem } from '../../Hooks/Parameters/useParamsItem';
import { CalendarType } from '../../Shared/types';
import { ParamsList } from '../../Types/ParametersBlockTypes';
import CustomSelect from '../CustomSelect/CustomSelect';
import Plus from '../Icons/Plus';

import styles from './TreeBlockParams.module.css';

function ParamsItem({
	placeholder,
	value,
	canCopy,
	dropdown,
	isTree,
	options,
	header,
	id,
	listItems,
	withUnderLine,
	readOnly,
	needRenderAddButton,
	onAddClick,
	isCalendar,
	className,
	title,
}: ParamsList) {
	const {
		currentDate,
		currentValue,
		handlePeriodSelect,
		handleParamsItemChange,
		closeItemClickHandler,
		copyClickHandler,
		dropdownHandler,
	} = useParamsItem({ value, header, placeholder, onAddClick });

	return (
		<div className={clsx(styles.item_container, className)}>
			<div className={clsx(styles.paramsItem, isCalendar && styles.calendar)}>
				{isCalendar ? (
					<Calendar
						dates={currentDate}
						type={CalendarType.Day}
						onSelect={handlePeriodSelect}
						key={`${placeholder}_${id}`}
					/>
				) : !dropdown ? (
					listItems ? (
						<>
							<div
								className={clsx(
									styles.list__container,
									listItems?.length > 5 && styles.list__scroll,
								)}
							>
								{listItems.map((item) => (
									<div key={item} className={styles.list__item}>
										<span>Канал {item}</span>
										<Button
											onClick={closeItemClickHandler(item)}
											className={styles.button_close}
										>
											<CloseIcon className={styles.iconClose} />
										</Button>
									</div>
								))}
							</div>
							{withUnderLine && <div className={styles.line}></div>}
						</>
					) : (
						<div className={styles.paramsItem__content}>
							<div
								className={clsx(
									styles.paramsItem__contentItem,
									needRenderAddButton && styles.paramsItem__small,
								)}
							>
								<input
									className={styles.paramsItem__input}
									placeholder={placeholder}
									value={currentValue}
									onChange={handleParamsItemChange}
									id={id}
									readOnly={readOnly}
									title={title || String(currentValue)}
								/>
								{currentValue && (
									<label className={styles.paramsItem__label} htmlFor={id}>
										{placeholder}
									</label>
								)}
							</div>
							{canCopy && (
								<Button
									onClick={copyClickHandler}
									className={clsx(styles.buttons, styles.buttons__copyBtn)}
									title={'Копировать'}
									tabIndex={-1}
								/>
							)}
						</div>
					)
				) : (
					<CustomSelect
						placeHolder={placeholder}
						options={options}
						value={currentValue}
						callback={dropdownHandler}
						isTree={isTree}
						readOnly={readOnly}
						isSmall={needRenderAddButton}
					/>
				)}
			</div>

			{needRenderAddButton && onAddClick && (
				<Plus
					className={styles.buttons__plusBtn}
					onClick={onAddClick(String(currentValue))}
				/>
			)}
		</div>
	);
}

export default ParamsItem;
