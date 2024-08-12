import React, { useEffect } from 'react';
import { Button } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import { $activeIds } from '../../Models/ActiveIds';
import { $user } from '../../Models/Auth';
import { getImagesCollectionFx } from '../../Models/ImagesCollection/effects';
import { $imagesCollectionForm } from '../../Models/ImagesCollectionForm';
import { resetCheckedImages } from '../../Models/ImagesCollectionParameters/events';
import { ModuleName } from '../../Shared/Types/moduleName';
import Preview from '../../UI/Preview';
import TablePair from '../../UI/TablePair';
import UploadFile from '../../UI/UploadFile';

import useControllers from './useControllers';
import useTablePair from './useTablePair';

import styles from './ImagesCollection.module.css';

function ImagesCollection() {
	const { previewImage } = useStore($imagesCollectionForm);
	const activeIds = useStore($activeIds);
	const user = useStore($user);
	const { data: imagesList } = useTablePair();
	const { onApply, onUpload, acceptanceTypes, isApplyDisabled } =
		useControllers();

	useEffect(() => {
		if (!user) {
			return;
		}
		getImagesCollectionFx({
			versionCode: activeIds.activeVersionId || 0,
			userId: user.preferredUsername,
			moduleName: ModuleName.ImagesCollection_getImagesCollectionFx,
		});
	}, [activeIds.activeVersionId, user]);

	useEffect(() => {
		return () => {
			resetCheckedImages();
		};
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.body}>
				<div className={styles.table}>
					<TablePair data={[imagesList]} className={styles.tablePair} />
				</div>
				<div className={styles.preview}>
					<Preview src={previewImage} alt={'Предпросмотр изображения'} />
				</div>
			</div>
			<div className={styles.footer}>
				<UploadFile
					id="images-collection-upload-file"
					title="Загрузить из файла"
					acceptedTypes={acceptanceTypes}
					onChange={onUpload}
					className={styles.upload}
				/>
				<Button
					className={styles.button}
					primary
					onClick={onApply}
					disabled={isApplyDisabled}
				>
					Применить
				</Button>
			</div>
		</div>
	);
}

export default ImagesCollection;
