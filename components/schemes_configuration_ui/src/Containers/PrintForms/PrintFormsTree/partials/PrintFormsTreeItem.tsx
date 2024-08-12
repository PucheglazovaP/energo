import { MouseEvent, useMemo } from 'react';
import { Tooltip } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { Crosshair } from '../../../../Icons';
import LinkOn from '../../../../Icons/LinkOn';
import { $selectedPrintFormPosition } from '../../../../Models/PrintForms';
import { setPrintFormPositioningPositionId } from '../../../../Models/PrintForms/events';
import { PrintFormTree } from '../../../../Shared/types';

import styles from '../PrintFormsTree.module.css';

type PrintFormTreeProps = {
	node: PrintFormTree;
	onUnsync: (node: PrintFormTree) => void;
	onSync: (node: PrintFormTree) => void;
};

function PrintFormsTreeItem(props: PrintFormTreeProps) {
	const { node, onSync, onUnsync } = props;
	const selectedPrintFormPosition = useStore($selectedPrintFormPosition);

	const handleSync = (evt: MouseEvent<HTMLButtonElement>) => {
		evt.stopPropagation();
		onSync(node);
	};

	const handleUnsync = (evt: MouseEvent<HTMLButtonElement>) => {
		evt.stopPropagation();
		onUnsync(node);
	};

	const handlePositioning = (evt: MouseEvent<HTMLButtonElement>) => {
		evt.stopPropagation();
		setPrintFormPositioningPositionId(node.positionId || 0);
	};

	const {
		tooltipTitle,
		clickHandler,
		buttonClassName,
		isButtonDisabled,
	}: {
		tooltipTitle: string;
		clickHandler: (evt: MouseEvent<HTMLButtonElement>) => void;
		buttonClassName: string;
		isButtonDisabled: boolean;
	} = useMemo(() => {
		if (node.positionId) {
			return {
				tooltipTitle: 'Отвязать',
				clickHandler: handleUnsync,
				buttonClassName: styles.node_button__link,
				isButtonDisabled: false,
			};
		}
		if (selectedPrintFormPosition?.id && !selectedPrintFormPosition?.treeId) {
			return {
				tooltipTitle: 'Привязать',
				clickHandler: handleSync,
				buttonClassName: styles.node_button__inactive,
				isButtonDisabled: false,
			};
		}
		return {
			tooltipTitle:
				'Выберите непривязанный элемент печатной формы для привязки',
			clickHandler: () => {},
			buttonClassName: clsx(
				styles.node_button__inactive,
				styles.node_button__disabled,
			),
			isButtonDisabled: true,
		};
	}, [node.positionId, selectedPrintFormPosition]);

	return (
		<div className={styles.node}>
			<p className={styles.node__title}>{node.nodeName}</p>
			<span className={styles.node__controllers}>
				{node.positionId && (
					<button
						className={clsx('button__empty', styles.node__button)}
						onClick={handlePositioning}
					>
						<Crosshair className={styles.node__crosshair} />
					</button>
				)}
				<Tooltip tooltip={tooltipTitle}>
					<span>
						<button
							className={clsx(
								'button__empty',
								styles.node__button,
								buttonClassName,
							)}
							onClick={clickHandler}
							disabled={isButtonDisabled}
						>
							<LinkOn className={styles.node__link} />
						</button>
					</span>
				</Tooltip>
			</span>
		</div>
	);
}

export default PrintFormsTreeItem;
