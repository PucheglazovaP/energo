import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { Attachment, Bin } from '../../Icons';
import Edit from '../../Icons/Edit';
import { $activeIds } from '../../Models/ActiveIds';
import { $user } from '../../Models/Auth';
import { setDynamicObjectImages } from '../../Models/EditMode/events';
import { $formContextMenu } from '../../Models/FormContextMenu';
import {
	deleteImageFx,
	updateFormObjectFx,
} from '../../Models/FormContextMenu/effects';
import {
	changeImageComment,
	deleteImage,
	selectImage,
} from '../../Models/FormContextMenu/events';
import { setType } from '../../Models/ImagesCollectionParameters/events';
import { CollectionType } from '../../Models/ImagesCollectionParameters/types';
import { openModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import {
	DynamicObjectConfiguration,
	DynamicObjectValue,
} from '../../Shared/Types/formObject';
import { ModuleName } from '../../Shared/Types/moduleName';
import Input from '../../UI/Input';
import { RenderCellParams, TableCell } from '../../UI/TablePair/types';

import styles from './DynamicObjectImages.module.css';

function createHeaderRow(): TableCell[] {
	return [
		{
			name: 'Number',
			value: '№',
			width: 46,
		},
		{
			name: 'Image',
			value: '',
			renderCell: () => (
				<div className={styles.attachment}>
					<Attachment />
				</div>
			),
			width: 76,
		},
		{
			name: 'Name',
			value: 'Имя файла',
			width: 160,
		},
		{
			name: 'Comment',
			value: 'Комментарий',
		},
		{
			name: 'Actions',
			value: '\u2003',
			width: 82,
		},
	];
}

/**
 * Hooks that represents all logic for dynamic object images table
 */
export function useTablePair() {
	const { object: dynamicObject } = useStore($formContextMenu);
	const activeIds = useStore($activeIds);
	const user = useStore($user);
	const { images } = dynamicObject as DynamicObjectConfiguration;
	const [intermediateComment, setIntermediateComment] = useState<{
		key: number;
		value: string;
	} | null>(null);

	// Get comment for image, intermediate or original one
	const getImageComment = (img: DynamicObjectValue) => {
		if (intermediateComment && intermediateComment.key === img.fileNumber) {
			if (intermediateComment.value) {
				return intermediateComment.value;
			}
		}
		return img.comment || '';
	};

	const resetIntermediateComment = () => {
		setIntermediateComment(null);
	};

	const onChangeComment = (
		evt: React.ChangeEvent<HTMLInputElement>,
		id: number,
	) => {
		setIntermediateComment({
			key: id,
			value: evt.target.value,
		});
	};

	const onCommentSubmit = (
		evt: React.KeyboardEvent<HTMLInputElement>,
		img: DynamicObjectValue,
	) => {
		if (!user) return;
		if (evt.key === 'Enter') {
			const comment = getImageComment(img);
			// Make request to update object in the database
			updateFormObjectFx({
				value: comment,
				paramIdx: img.fileNumber,
				objectId: activeIds.formContextMenuId,
				versionId: activeIds.activeVersionId || null,
				paramName: 'comment',
				userId: user.preferredUsername,
				moduleName: ModuleName.UseTablePair_updateFormObjectFx,
			}).then((rowsUpdated) => {
				if (rowsUpdated !== 0) {
					// If request succeeded, change original comment
					// to intermediate one
					if (intermediateComment) {
						changeImageComment({
							imageId: intermediateComment.key,
							comment: intermediateComment.value,
						});
					}
					toast.success(
						`Комментарий к изображению ${img.fileName} успешно добавлен`,
					);
				}
			});
			evt.currentTarget.blur();
			return;
		}
		if (evt.key === 'Escape') {
			evt.currentTarget.blur();
			return;
		}
	};

	const onDeleteImage = (image: DynamicObjectValue) => {
		if (!user) return;
		// Make request to delete image from the object in the database
		deleteImageFx({
			objectId: dynamicObject?.id || null,
			objectIdx: image.fileNumber,
			parameterName: 'FilePicture',
			userId: user.preferredUsername,
			moduleName: ModuleName.UseTablePair_deleteImageFx,
		}).then((rowsDeleted) => {
			if (rowsDeleted !== 0) {
				// If request succeeded, delete it on the front
				deleteImage(image.fileNumber);
				toast.success(`Изображение ${image.fileName} успешно удалено`);
				// Clear the intermediate comment if it belongs
				// to deleted image
				if (image.fileNumber === intermediateComment?.key) {
					resetIntermediateComment();
				}
			}
		});
	};

	const onUpdateImage = (image: DynamicObjectValue) => {
		selectImage(image.fileNumber);
		setType(CollectionType.single);
		openModal(RegisteredModals.ImagesCollection);
	};
	const tableRows: TableCell[][] = [
		createHeaderRow(),
		...images
			.sort((a, b) => a.fileNumber - b.fileNumber)
			.map((img) => [
				{
					name: 'Number',
					value: img.fileNumber,
					width: 45,
				},
				{
					name: 'Image',
					value: '',
					renderCell: () => (
						<div className={styles.image}>
							<img src={img.url} alt={''} />{' '}
						</div>
					),
					width: 75,
				},
				{
					name: 'Name',
					value: img.fileName,
					width: 160,
				},
				{
					name: 'Comment',
					value: '',
					renderCell: () => (
						<Input
							type="text"
							value={getImageComment(img)}
							onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
								onChangeComment(evt, img.fileNumber)
							}
							onKeyUp={(evt) => onCommentSubmit(evt, img)}
							onBlur={resetIntermediateComment}
						/>
					),
				},
				{
					name: 'Actions',
					value: '',
					renderCell: (params: RenderCellParams) => (
						<div
							className={clsx(
								styles.actions,
								params.isHover
									? styles.actions__visible
									: styles.actions__hidden,
							)}
						>
							<Button
								className={styles.action}
								onClick={() => onUpdateImage(img)}
							>
								<Edit />
							</Button>
							<Button
								className={styles.action}
								onClick={() => onDeleteImage(img)}
							>
								<Bin />
							</Button>
						</div>
					),
					width: 80,
				},
			]),
	];

	// update dynamic object images in the form when it changed
	// in dynamic object images modal
	useEffect(() => {
		if (dynamicObject) {
			setDynamicObjectImages({
				id: dynamicObject.id,
				images: (dynamicObject as DynamicObjectConfiguration).images,
			});
		}
	}, [(dynamicObject as DynamicObjectConfiguration).images]);

	return {
		tableRows,
	};
}
