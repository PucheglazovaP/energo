import { useId } from 'react';
import { Tooltip } from '@evraz/ui-kit';
import clsx from 'clsx';

import { AddFile, IconDelete, IconEditing } from './iconEditing';
import { ParameterDisplayProps, TooltipDirection } from './types';

import styles from './Parameter.module.css';

function ParameterDisplayFile({
	className,
	style,
	value,
	onClick,
	onResetClick,
	isHintEnabled,
}: ParameterDisplayProps) {
	const id = useId();
	const resetValue = () => {
		onResetClick && onResetClick();
	};
	const handleAddFile = () => {
		onClick && onClick('');
	};
	return (
		<div
			className={clsx(styles.parameter_display_file, className)}
			style={style}
		>
			<span>{value || <p className={styles.no_file}>Не выбран</p>}</span>
			<div className={clsx(styles.file_elements)}>
				<label className={clsx(styles.file_upload, className)} style={style}>
					<input
						className={clsx(styles.file_input)}
						type="button"
						name="upload_underlayer"
						onClick={() => {
							if (value) onClick && onClick(value);
						}}
						title="Choose a file"
					/>

					{value ? (
						<Tooltip
							tooltip="Редактировать"
							disabled={!isHintEnabled}
							forceDirection={TooltipDirection.Down}
						>
							<div key={id} className={clsx(styles.param_condition_file)}>
								<IconEditing />
							</div>
						</Tooltip>
					) : (
						<Tooltip
							tooltip="Добавить файл"
							disabled={!isHintEnabled}
							forceDirection={TooltipDirection.Left}
						>
							<button
								key={id}
								onClick={handleAddFile}
								className={clsx(styles.param_condition_file)}
							>
								<AddFile />
							</button>
						</Tooltip>
					)}
				</label>

				{value && (
					<Tooltip
						tooltip="Удалить"
						disabled={!isHintEnabled}
						forceDirection={TooltipDirection.Down}
					>
						<button
							key={id}
							onClick={resetValue}
							className={clsx(styles.param_delete)}
						>
							<IconDelete />
						</button>
					</Tooltip>
				)}
			</div>
		</div>
	);
}
export default ParameterDisplayFile;
