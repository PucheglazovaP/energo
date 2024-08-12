import clsx from 'clsx';

import ContextMenu from '../../../UI/ContextMenu';

import { PrintFormParametersListProps } from './types';
import usePrintFormParametersContextMenu from './usePrintFormParametersContextMenu';

import styles from './PrintFormParametersList.module.css';

function PrintFormParametersList({
	className,
	style,
}: PrintFormParametersListProps) {
	const { parametersList, contextMenuItems, position, setPosition } =
		usePrintFormParametersContextMenu();

	if (parametersList.length === 0) {
		return <div>Нет данных</div>;
	}

	return (
		<div className={clsx(styles.root, className)} style={style}>
			{parametersList}
			<ContextMenu
				items={contextMenuItems}
				position={position}
				setPosition={setPosition}
			/>
		</div>
	);
}

export default PrintFormParametersList;
