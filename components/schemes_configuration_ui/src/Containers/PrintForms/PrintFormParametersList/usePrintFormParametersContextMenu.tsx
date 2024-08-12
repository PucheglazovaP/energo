import React, { useMemo, useState } from 'react';
import { useStore } from 'effector-react';

import { Bin, Edit } from '../../../Icons';
import { openModal } from '../../../Models/Modal/events';
import {
	$printFormParameters,
	$selectedPrintFormParameterId,
} from '../../../Models/PrintForms';
import {
	setSelectedPrintFormParameterId,
	setSelectedPrintFormParameterLinkId,
	setSelectedPrintFormParameterName,
} from '../../../Models/PrintForms/events';
import { RegisteredModals } from '../../../Shared/modalsConfig';
import { PrintFormParameter } from '../../../Shared/types';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../../UI/ContextMenu/types';
import PrintFormParameterCard from '../PrintFormParameterCard';

function usePrintFormParametersContextMenu() {
	const selectedParameters = useStore($printFormParameters);
	const [position, setPosition] = useState<ContextMenuPosition | null>(null);

	const selectedParameterId: number = useStore($selectedPrintFormParameterId);

	function handleUnsyncButtonClick() {
		openModal(RegisteredModals.PrintFormParameterUnsync);
	}
	function handleEditButtonClick() {
		openModal(RegisteredModals.EditPrintFormParameter);
	}
	// context menu edit handler function is to be done
	const contextMenuItems: ContextMenuItem[] = [
		{
			name: 'Редактировать',
			onClick: handleEditButtonClick,
			renderFn: () => (
				<div className={'context_menu_item'}>
					<Edit className={'context_menu_icon'} />
					<span>Редактировать</span>
				</div>
			),
		},
		{
			name: 'Удалить',
			onClick: handleUnsyncButtonClick,
			renderFn: () => (
				<div className={'context_menu_item'}>
					<Bin className={'context_menu_icon'} />
					<span>Удалить</span>
				</div>
			),
		},
	];

	const parametersList: JSX.Element[] = useMemo(
		() =>
			selectedParameters.map((parameter: PrintFormParameter) => {
				function handleContextMenuOpen(evt: React.MouseEvent<HTMLDivElement>) {
					evt.preventDefault();
					setPosition({
						x: evt.pageX,
						y: evt.pageY,
					});
					setSelectedPrintFormParameterId(parameter.paramId);
					setSelectedPrintFormParameterLinkId(parameter.linkId);
					setSelectedPrintFormParameterName(parameter.paramName);
				}

				return (
					<PrintFormParameterCard
						key={parameter.paramId}
						{...parameter}
						onContextMenu={handleContextMenuOpen}
						isParameterSelected={selectedParameterId === parameter.paramId}
					/>
				);
			}),
		[selectedParameters, selectedParameterId],
	);

	return {
		parametersList,
		contextMenuItems,
		position,
		setPosition,
	};
}

export default usePrintFormParametersContextMenu;
