import clsx from 'clsx';

import { useFormulaViewer } from '../../Facades/useFormulaViewer';

import { FormulaViewerProps } from './types';

import styles from './FormulaEditor.module.css';

function FormulaViewer({
	className,
	formula,
	onSelectFormulaElement,
	setFormulaText,
}: FormulaViewerProps) {
	const { canvasRef } = useFormulaViewer(
		formula,
		onSelectFormulaElement,
		setFormulaText,
	);

	return (
		<div className={clsx(styles.body, className)}>
			<div
				className={styles.editor}
				role="textbox"
				tabIndex={0}
				onKeyDown={(e) => {
					if (
						['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)
					) {
						e.preventDefault();
					}
				}}
			>
				<canvas
					ref={canvasRef}
					tabIndex={0}
					className={styles.canvas}
					width={600}
				/>
			</div>
		</div>
	);
}

export default FormulaViewer;
