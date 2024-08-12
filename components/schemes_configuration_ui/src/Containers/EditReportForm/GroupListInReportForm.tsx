import { useCallback } from 'react';
import {
	DragDropContext,
	DraggableLocation,
	DropResult,
} from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import { Button } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import AngleArrowDoubleRightIcon from '../../Icons/AngleArrowDoubleRight';
import { $user } from '../../Models/Auth';
import {
	deleteGroupFx,
	moveGroupFx,
} from '../../Models/ReportFormProperties/effects';
import { moveGroup } from '../../Models/ReportFormProperties/events';
import { ModuleName } from '../../Shared/Types/moduleName';
import TablePair from '../../UI/TablePair';

import { useEditForm } from './useEditForm';

import styles from './EditReportForm.module.css';

function GroupListInReportForm() {
	const { tableRows, formId, selectedGroupsInReportForm, groupsInReportForm } =
		useEditForm();
	const user = useStore($user);

	const onMoveGroup = async (
		source: DraggableLocation,
		destination: DraggableLocation,
	) => {
		if (!user) return;
		const [from, to] = [source.index - 1, destination.index - 1];
		moveGroupFx({
			objectIdx: source.index,
			move: to - from,
			parameterName: 'ReportGroups',
			formId,
			userId: user.preferredUsername,
			moduleName: ModuleName.GroupListInReportForm_moveGroupFx,
		})
			.then((rowsMoved) => {
				if (rowsMoved) {
					moveGroup({
						from: source.index - 1,
						to: destination.index - 1,
					});
					toast.success('Группа успешно перемещена');
				}
			})
			.catch(() => {
				toast.error('Не удалось переместить группу');
			});
	};

	// Reorder images
	const onDragEnd = (result: DropResult) => {
		const { source, destination } = result;
		if (!destination) {
			return;
		}
		if (destination.index === 0) {
			toast.error('Нельзя переместить элемент выше заголовка таблицы');
			return;
		}
		if (destination.index === source.index) {
			return;
		}
		onMoveGroup(source, destination);
	};

	const onDeleteBtnClick = useCallback(() => {
		if (!user) {
			return;
		}
		if (formId) {
			const deleteAllFlag =
				selectedGroupsInReportForm.length === groupsInReportForm.length ? 1 : 0;
			deleteGroupFx({
				formId,
				groups: selectedGroupsInReportForm,
				deleteAllFlag,
				userId: user.preferredUsername,
				moduleName: ModuleName.GroupListInReportForm_deleteGroupFx,
			});
		}
	}, [formId, selectedGroupsInReportForm, groupsInReportForm, user]);
	return (
		<div className={styles.group_list}>
			<div className={styles.panel}>
				<h3 className={styles.title}>Группы в отчете</h3>
				<div className={styles.btns}>
					<Button
						className={styles.btn}
						disabled={selectedGroupsInReportForm.length === 0}
						onClick={onDeleteBtnClick}
					>
						{' '}
						<AngleArrowDoubleRightIcon className={styles.icon} />
						Удалить
					</Button>
				</div>
			</div>

			<div className={styles.container}>
				<DragDropContext onDragEnd={onDragEnd}>
					<TablePair
						data={[tableRows]}
						className={styles.table}
						isDraggable
						draggableId="groups"
					/>
				</DragDropContext>
			</div>
		</div>
	);
}

export default GroupListInReportForm;
