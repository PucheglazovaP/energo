import { useCallback } from 'react';
import { Button } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import { $activeIds } from '../../Models/ActiveIds';
import { $user } from '../../Models/Auth';
import { $editMode } from '../../Models/EditMode';
import { uploadImageFx } from '../../Models/EditMode/effects';
import {
	setDataForEditing,
	updateFormParameter,
} from '../../Models/EditMode/events';
import { $imagesCollectionForm } from '../../Models/ImagesCollectionForm';
import { closeModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';

import styles from './NewImageWarning.module.css';

function NewImageWarning() {
	const { existingFile, editedFile, editedFileName, id } = useStore($editMode);
	const user = useStore($user);
	const { activeVersion } = useStore($activeIds);
	const { formParameters } = useStore($imagesCollectionForm);
	const handleReset = useCallback(() => {
		setDataForEditing({
			existingFile: '',
			editedParameterCode: null,
			editedParameterName: '',
			editedFile: '',
			editedFileName: '',
		});
		closeModal(RegisteredModals.NewImageWarning);
	}, []);

	const handleReplication = useCallback(() => {
		if (!user) {
			return;
		}
		const matches = editedFile.toString().match(/^data:(.*;base64,)?(.*)$/);
		const base64WithoutPrefix = matches?.[2];
		if (base64WithoutPrefix)
			uploadImageFx({
				formId: id as number,
				fileName: editedFileName,
				image: base64WithoutPrefix,
				replaceFlag: 1,
				versionCode: activeVersion?.code as number,
				userId: user.preferredUsername,
				moduleName: ModuleName.NewImageWarning_uploadImageFx,
			});
		closeModal(RegisteredModals.NewImageWarning);
	}, [editedFileName, editedFile, id, activeVersion?.code, user]);

	const handleSelectExistingImage = useCallback(() => {
		updateFormParameter({
			value: editedFileName,
			parameterCode: formParameters?.code ?? 0,
			formId: id as number,
			parameterName: formParameters?.name || '',
			versionCode: activeVersion?.code as number,
		});
		setDataForEditing({
			formBackground: existingFile,
		});
		closeModal(RegisteredModals.NewImageWarning);
	}, [editedFileName, formParameters, existingFile, id, activeVersion?.code]);

	return (
		<div className={styles.container}>
			<div className={styles.body}>
				<img src={existingFile} alt="existingImage" className={styles.img} />
			</div>
			<div className={styles.footer}>
				<Button onClick={handleReset}>Отмена</Button>
				<Button onClick={handleReplication}>
					Заменить существующее изображение
				</Button>
				<Button onClick={handleSelectExistingImage}>
					Выбрать существующее изображение
				</Button>
			</div>
		</div>
	);
}

export default NewImageWarning;
