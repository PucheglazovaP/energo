import { useId } from 'react';
import { toast } from 'react-toastify';
import { Tooltip } from '@evraz/ui-kit';
import clsx from 'clsx';

import CopyIcon from '../../Icons/Copy';

import { IconCircularArrows, IconEditing } from './iconEditing';
import { ParameterDisplayProps, TooltipDirection } from './types';

import styles from './Parameter.module.css';

function ParameterModal({
	className,
	style,
	value,
	onModalOpen,
	onResetClick,
	disabled,
	isHintEnabled,
}: ParameterDisplayProps) {
	const startEditing = () => {
		onModalOpen && onModalOpen();
	};
	const resetValue = () => {
		onResetClick && onResetClick();
	};
	const id = useId();
	const copyValue = () => {
		navigator.clipboard.writeText(value || '').then(() => {
			toast.success('Скопировано');
		});
	};
	return (
		<div
			className={clsx(styles.parameter_display_modal, className)}
			style={style}
		>
			<span>{value !== 'null' ? value : 'Н/Д'}</span>
			<div className={styles.buttons}>
				{!disabled && (
					<>
						<Tooltip
							tooltip="Редактировать"
							forceDirection={TooltipDirection.Left}
							className={styles.tooltip}
							disabled={!isHintEnabled}
						>
							<button
								key={id}
								className={clsx(styles.param_condition_reset)}
								onClick={startEditing}
							>
								<IconEditing />
							</button>
						</Tooltip>
						{value !== 'null' && (
							<Tooltip
								tooltip="По умолчанию"
								forceDirection={TooltipDirection.Down}
								className={styles.tooltip}
								disabled={!isHintEnabled}
							>
								<button
									key={id}
									onClick={resetValue}
									className={clsx(styles.param_condition_reset)}
								>
									<IconCircularArrows />
								</button>
							</Tooltip>
						)}
					</>
				)}
				{value !== 'null' && (
					<Tooltip
						tooltip="Копировать"
						forceDirection={TooltipDirection.Down}
						className={styles.tooltip}
						disabled={!isHintEnabled}
					>
						<button
							key={id}
							onClick={copyValue}
							className={clsx(styles.param_condition_reset)}
						>
							<CopyIcon />
						</button>
					</Tooltip>
				)}
			</div>
		</div>
	);
}
export default ParameterModal;
