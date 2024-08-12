import React, { useCallback, useMemo, useState } from 'react';

import { selectSupportTooltipMode } from '../../Store/reducers/AppSlice/appSelectors';
import { toggleSupportTooltipMode } from '../../Store/reducers/AppSlice/AppSlice';
import { switchParametersActive } from '../../Store/reducers/ParametersSlice/parametersSlice';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import Parameter from '../../UI/Parameter';
import { ParameterType } from '../../UI/Parameter/types';
import useAppDispatch from '../Store/useAppDispatch';
import { useAppSelector } from '../Store/useAppSelector';

import styles from '../../Components/HomePage/HomePageComponents.module.scss';

export function useTooltipMenu() {
	const dispatch = useAppDispatch();
	const parametersButtonHandler = useCallback(() => {
		dispatch(switchParametersActive());
	}, [dispatch]);
	const [position, setPosition] = useState<ContextMenuPosition | null>(null);
	const handleContextMenu = (evt: React.MouseEvent<HTMLButtonElement>) => {
		evt.stopPropagation();
		if (!position) setPosition({ x: 0, y: 30 });
		else setPosition(null);
	};
	const isSupportTooltipMode = useAppSelector(selectSupportTooltipMode);

	const onToggleUpdate = useCallback(() => {
		dispatch(toggleSupportTooltipMode());
	}, [isSupportTooltipMode]);

	const contextMenuItems: ContextMenuItem[] = useMemo(
		() => [
			{
				name: 'Отобразить подсказки',
				body: (
					<Parameter
						type={ParameterType.Toggle}
						caption={'Отобразить подсказки'}
						className={styles.switcher}
						value={String(isSupportTooltipMode)}
						onClick={onToggleUpdate}
					/>
				),
			},
		],
		[position],
	);
	return {
		handleContextMenu,
		contextMenuItems,
		parametersButtonHandler,
		position,
		setPosition,
	};
}
