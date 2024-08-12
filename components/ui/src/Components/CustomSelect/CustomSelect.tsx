import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';

import UnitsForm from '../../Containers/UnitsForm';
import { PreferenceType } from '../../Types/PreferenceTypes';
import { UnitsTreeItem } from '../../Types/UnitsTreeTypes';

import styles from './CustomSelect.module.css';

interface CustomSelectType {
	placeHolder?: string;
	options?: PreferenceType[] | UnitsTreeItem[];
	callback: CallableFunction;
	value?: string | number;
	isTree?: boolean;
	readOnly?: boolean;
	isSmall?: boolean;
}

function CustomSelect({
	placeHolder,
	options,
	callback,
	value,
	isTree,
	readOnly,
	isSmall,
}: CustomSelectType) {
	const [active, setActive] = useState(false);
	const valueHandler = useCallback(
		(id: number) => {
			console.log(id);
			setActive(false);
			callback(id);
		},
		[callback],
	);

	const toggleHandler = useCallback(
		() => setActive((prev) => (readOnly ? prev : !prev)),
		[readOnly],
	);
	const mouseLeaveHandler = useCallback(() => setActive(false), []);

	const textValue = useMemo(() => {
		if (isTree) {
			const current = (options as UnitsTreeItem[]).find(
				(item) => item.id === value,
			);
			if (current) return current.displayName;
			return undefined;
		} else {
			const current = (options as PreferenceType[]).find(
				(item) => item.ID === value,
			);
			if (current) return current.Name;
			return undefined;
		}
	}, [value, options]);

	return (
		<div className={styles.customSelect} onMouseLeave={mouseLeaveHandler}>
			<div className={styles.customSelect__params}>
				<span
					onClick={toggleHandler}
					aria-hidden
					className={clsx(
						styles.header,
						!textValue && styles.header__inactive,
						isSmall && styles.header__small,
					)}
					id={placeHolder}
				>
					{textValue || placeHolder}
				</span>
				{textValue && (
					<label className={styles.header__label} htmlFor={placeHolder}>
						{placeHolder}
					</label>
				)}
				<div className={styles.container}>
					{active && (
						<ul
							className={clsx(
								styles.dropdown,
								isSmall && styles.dropdown__absolute,
							)}
						>
							{isTree ? (
								<UnitsForm onConfirm={valueHandler} />
							) : (
								(options as PreferenceType[]).map((el, index) => (
									<li
										key={`${el}_${index + 1}`}
										onClick={() => valueHandler(el.ID)}
										aria-hidden
										className={styles.dropdown__item}
									>
										{el.Name}
									</li>
								))
							)}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}

export default CustomSelect;
