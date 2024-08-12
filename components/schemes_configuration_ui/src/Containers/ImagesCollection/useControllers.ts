import React, { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useStore } from 'effector-react';

import { $activeIds } from '../../Models/ActiveIds';
import { $user } from '../../Models/Auth';
import {
	setDataForEditing,
	updateFormParameter,
} from '../../Models/EditMode/events';
import { $formContextMenu } from '../../Models/FormContextMenu';
import {
	addImagesFx,
	updateFormObjectFx,
	uploadObjectImageFx,
} from '../../Models/FormContextMenu/effects';
import { changeImagePicture } from '../../Models/FormContextMenu/events';
import { getImagesCollectionFx } from '../../Models/ImagesCollection/effects';
import { Image } from '../../Models/ImagesCollection/types';
import { $imagesCollectionForm } from '../../Models/ImagesCollectionForm';
import { loadBinaryImage } from '../../Models/ImagesCollectionParameters/effects';
import {
	resetCheckedImages,
	setFormParameters,
	switchImage,
	toggleImage,
} from '../../Models/ImagesCollectionParameters/events';
import { CollectionType } from '../../Models/ImagesCollectionParameters/types';
import { closeModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { DynamicObjectConfiguration } from '../../Shared/Types/formObject';
import { ModuleName } from '../../Shared/Types/moduleName';
import { AcceptanceTypes } from '../../UI/UploadFile/types';

/**
 * This hook contains of all logic for controlling images collection form
 * Currently, it supports logic for using images collection in the
 * dynamic object images form and in form properties of dynamic
 * object ( to change underlayer of the form)
 */
function useControllers() {
	const { checkedImages, versionId, type, formParameters } = useStore(
		$imagesCollectionForm,
	);
	const activeIds = useStore($activeIds);
	const user = useStore($user);
	const { object: dynamicObject, selectedImageId } = useStore($formContextMenu);

	const addImagesToDynamicObject = useCallback(async () => {
		if (!user) {
			return;
		}
		await addImagesFx({
			images: checkedImages,
			versionId,
			startFileNumber:
				(dynamicObject as DynamicObjectConfiguration)?.images.length || 1,
			objectId: dynamicObject?.id || 0,
			moduleName:
				ModuleName.ImagesCollection_useControllers_addImagesToDynamicObject,
			userId: user.preferredUsername,
		});
		closeModal(RegisteredModals.ImagesCollection);
		resetCheckedImages();
	}, [checkedImages, dynamicObject, versionId]);

	const updateImageOfDynamicObject = async () => {
		if (!user) {
			return;
		}
		await updateFormObjectFx({
			paramName: 'FilePicture',
			versionId: activeIds.activeVersionId || null,
			objectId: activeIds.formContextMenuId,
			paramIdx: selectedImageId,
			value: checkedImages[0].name,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseControllers_updateFormObjectFx,
		}).then((rowsUpdated) => {
			if (rowsUpdated !== 0) {
				const updatedImage = (
					dynamicObject as DynamicObjectConfiguration
				).images.find((img) => img.fileNumber == selectedImageId);
				toast.success(
					`Картинка для изображения ${updatedImage?.fileName} успешно обновлена`,
				);
				loadBinaryImage({
					id: checkedImages[0].id,
					userId: user.preferredUsername,
					moduleName: ModuleName.UseControllers_loadBinaryImage,
				}).then((bin) => {
					changeImagePicture({
						id: selectedImageId,
						image: {
							...checkedImages[0],
							binary: bin,
						},
					});
				});
			}
		});
		closeModal(RegisteredModals.ImagesCollection);
		resetCheckedImages();
	};

	const changeFormUnderlayer = () => {
		if (!user) {
			return;
		}
		const selectedImage: Image = checkedImages[0];
		loadBinaryImage({
			id: selectedImage.id,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseControllers_loadBinaryImage,
		}).then((bin) => {
			updateFormParameter({
				formId: activeIds.formId as number,
				value: selectedImage.name,
				parameterCode: formParameters?.code ?? 0,
				parameterName: formParameters?.name || '',
				versionCode: activeIds.activeVersionId ?? 90,
			});
			setDataForEditing({
				editedParameterCode: formParameters?.code,
				editedParameterName: formParameters?.name,
				formBackground: bin,
			});
			setFormParameters(null);
			closeModal(RegisteredModals.ImagesCollection);
			resetCheckedImages();
		});
	};

	const onUpload = (evt: React.ChangeEvent<HTMLInputElement>) => {
		if (evt.target.files) {
			if (!user) {
				return;
			}
			const file = evt.target.files[0];
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				const base64WithoutPrefix = reader.result
					?.toString()
					.split('base64,')[1];
				if (base64WithoutPrefix) {
					uploadObjectImageFx({
						binary: base64WithoutPrefix,
						formId: activeIds.formId,
						name: file.name,
						userId: user.preferredUsername,
						versionCode: activeIds.activeVersionId || 0,
						moduleName: ModuleName.UseControllers_uploadObjectImageFx,
					}).then(
						function handleResult(result) {
							const { id } = result;
							if (type === CollectionType.multiple) {
								toggleImage(id);
							} else {
								switchImage(id);
							}
							toast.success('Изображение успешно загружено');
							getImagesCollectionFx({
								versionCode: activeIds.activeVersionId || 0,
								userId: user.preferredUsername,
								moduleName: ModuleName.UseControllers_getImagesCollectionFx,
							});
						},
						/* 						function handleError() {
							openModal(RegisteredModals.NewImageWarning);
						}, */
					);
				}
			};
		}
	};

	const acceptanceTypes = [
		AcceptanceTypes.jpeg,
		AcceptanceTypes.bmp,
		AcceptanceTypes.png,
		AcceptanceTypes.gif,
		AcceptanceTypes.svg,
		AcceptanceTypes.wmf,
	];

	const isApplyDisabled = !checkedImages.length;

	const onApply = useCallback(() => {
		if (formParameters) {
			changeFormUnderlayer();
		} else {
			if (type === CollectionType.multiple) {
				addImagesToDynamicObject();
			} else {
				updateImageOfDynamicObject();
			}
		}
	}, [
		formParameters,
		type,
		changeFormUnderlayer,
		addImagesToDynamicObject,
		updateImageOfDynamicObject,
	]);

	return {
		onApply,
		isApplyDisabled,
		acceptanceTypes,
		onUpload,
	};
}

export default useControllers;
