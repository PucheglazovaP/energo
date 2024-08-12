import {
	DragDropContext,
	DraggableLocation,
	DropResult,
} from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import { Button } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import { Plus } from '../../Icons';
import { $user } from '../../Models/Auth';
import { $formContextMenu } from '../../Models/FormContextMenu';
import { moveImageFx } from '../../Models/FormContextMenu/effects';
import { moveImage } from '../../Models/FormContextMenu/events';
import { setType } from '../../Models/ImagesCollectionParameters/events';
import { CollectionType } from '../../Models/ImagesCollectionParameters/types';
import { openModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';
import TablePair from '../../UI/TablePair';

import { useTablePair } from './useTablePair';

import styles from './DynamicObjectImages.module.css';

function DynamicObjectImages() {
	const { object: dynamicObject } = useStore($formContextMenu);
	const user = useStore($user);
	const { tableRows } = useTablePair();

	const onMoveImage = async (
		source: DraggableLocation,
		destination: DraggableLocation,
	) => {
		if (!user) return;
		const [from, to] = [source.index - 1, destination.index - 1];
		moveImageFx({
			objectId: dynamicObject?.id || 0,
			objectIdx: source.index,
			move: to - from,
			parameterName: 'FilePicture',
			userId: user.preferredUsername,
			moduleName: ModuleName.DynamicObjectImages_moveImageFx,
		})
			.then((rowsMoved) => {
				if (rowsMoved) {
					moveImage({
						from: source.index - 1,
						to: destination.index - 1,
					});
					toast.success('Изображение успешно перемещено');
				}
			})
			.catch(() => {
				toast.error('Не удалось переместить изображение');
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
		onMoveImage(source, destination);
	};

	const onAddImage = () => {
		setType(CollectionType.multiple);
		openModal(RegisteredModals.ImagesCollection);
	};

	return (
		<div className={styles.container}>
			<DragDropContext onDragEnd={onDragEnd}>
				<TablePair
					data={[tableRows]}
					className={styles.table}
					isDraggable
					draggableId="images"
				/>
			</DragDropContext>
			<div className={styles.footer}>
				<Button className={styles.add} onClick={onAddImage}>
					<Plus />
					Добавить
				</Button>
			</div>
		</div>
	);
}

export default DynamicObjectImages;
