import React from 'react';
import { ArrowRepeat, Button } from '@evraz/ui-kit';

import LinkedParameterTableParam from '../LinkedParameterTableParam/LinkedParameterTableParam';
import LinkedPointTableParam from '../LinkedPointTableParam/LinkedPointTableParam';
import VisualizationGroupParam from '../VisualizationGroupParam/VisualizationGroupParam';

import AccountingNodeParameters from './AccountingNodeParameters';
import useAccountingNode from './useAccountingNode';

import styles from './AccountingNode.module.css';

function AccountingNode() {
	const {
		isUpdateMode,
		handleCloseModal,
		linkedPointHeader,
		linkedPointData,
		linkedParameterHeader,
		linkedParameterData,
		visualizationGroupHeader,
		visualizationGroupData,
		handleEditLinkedPoint,
		handleUnbindLinkedParameter,
		handleEditLinkedParameter,
		handleUnbindVisualizationGroup,
		handleEditVisualizationGroup,
		handleSaveAccountingNode,
	} = useAccountingNode();

	return (
		<div className={styles.modal_body}>
			<div className={styles.accounting_node_container}>
				<AccountingNodeParameters />
			</div>
			<VisualizationGroupParam
				data={visualizationGroupData}
				header={visualizationGroupHeader}
				handleEditVisualizationGroup={handleEditVisualizationGroup}
				handleUnbindVisualizationGroup={handleUnbindVisualizationGroup}
			/>
			<LinkedPointTableParam
				data={linkedPointData}
				header={linkedPointHeader}
				handleEditLinkedPoint={handleEditLinkedPoint}
				isUpdateMode={isUpdateMode}
			/>
			<LinkedParameterTableParam
				data={linkedParameterData}
				header={linkedParameterHeader}
				handleEditLinkedParameter={handleEditLinkedParameter}
				handleUnbindParameter={handleUnbindLinkedParameter}
			/>

			<div className={styles.buttons}>
				<Button onClick={handleCloseModal}>Отменить</Button>
				<Button
					className={styles.confirm_button}
					onClick={handleSaveAccountingNode}
				>
					Сохранить
				</Button>
				<ArrowRepeat />
			</div>
		</div>
	);
}

export default AccountingNode;
