import clsx from 'clsx';

import { IconCircleCheck, IconCircleCross } from '../../../UI/Icon';

import { PrintFormParameterCardProps } from './types';

import styles from './PrintFormParameterCard.module.css';

function PrintFormParameterCard({
	paramName,
	valueName,
	isActive,
	className,
	style,
	paramId,
	isParameterSelected,
	dateFromString,
	dateToString,
	onContextMenu,
}: PrintFormParameterCardProps) {
	return (
		<div
			className={clsx(styles.root, className, styles.parameter_card, {
				[styles.parameter_card__active]: isActive,
				[styles.parameter_card__selected]: isParameterSelected,
			})}
			style={style}
			onContextMenu={onContextMenu}
			id={String(paramId)}
		>
			<div className={styles.param_name}>{paramName}</div>
			<div className={styles.param_value}>{valueName}</div>
			<div className={styles.date_row}>
				{isActive ? (
					<IconCircleCheck className={clsx(styles.check_icon, styles.icon)} />
				) : (
					<IconCircleCross className={clsx(styles.cross_icon, styles.icon)} />
				)}
				<div
					className={styles.date}
				>{`${dateFromString} - ${dateToString}`}</div>
			</div>
		</div>
	);
}

export default PrintFormParameterCard;
