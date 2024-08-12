import { ChangeEvent, MouseEvent } from 'react';
import { BasketFirst, Button, Download, SymbolPlus } from '@evraz/ui-kit';
import { useStore } from 'effector-react';
import { saveAs } from 'file-saver';

import { $nsiUserParameterFilesList } from '../../../../Models/NSIUserParameters';
import {
	deleteUserParameterFileFx,
	getUserParameterFileFx,
	getUserParameterFilesListFx,
	getUserParametersListFx,
	saveUserParameterValueFx,
} from '../../../../Models/NSIUserParameters/effects';
import { ModuleName } from '../../../../Shared/Types/moduleName';
import Divider from '../../../../UI/Divider';
import UploadFile from '../../../../UI/UploadFile';
import DataTable from '../DataTable';

import { FilesListControlName, FilesListProps } from './types';
import { acceptedFileTypes, convertBase64ToFile, getTableData } from './utils';

import styles from './FilesList.module.css';

function FilesList({ unit, userId, viewMode, parameter }: FilesListProps) {
	const filesList = useStore($nsiUserParameterFilesList);

	const files =
		parameter.valueId !== null && filesList[parameter.valueId]
			? filesList[parameter.valueId]
			: null;

	const tableData =
		parameter.valueId !== null && files !== null
			? getTableData(files, userId, parameter.valueId)
			: null;

	const handleUpdateParameter = () => {
		getUserParametersListFx({
			userId,
			unitId: unit.itemNumber,
			unitTypeId: unit.typeId,
			parameterId: parameter.id,
			moduleName: ModuleName.FilesList_getUserParametersListFx,
		}).then((requestedParameters) => {
			requestedParameters.forEach((requestedParameter) => {
				if (
					requestedParameter.id === parameter.id &&
					requestedParameter.valueId
				) {
					getUserParameterFilesListFx({
						userId,
						valueId: requestedParameter.valueId,
						moduleName: ModuleName.FilesList_getUserParameterFilesListFx,
					});
				}
			});
		});
	};

	const handleControlClick = (e: MouseEvent<HTMLButtonElement>) => {
		const { id } = e.currentTarget;

		if (
			id === FilesListControlName.DOWNLOAD &&
			tableData !== null &&
			tableData.checkedFilesList.length !== 0
		) {
			tableData.checkedFilesList.forEach((checkedFile) => {
				getUserParameterFileFx({
					userId,
					fileId: checkedFile.id,
					moduleName: ModuleName.FilesList_getUserParameterFileFx,
				}).then((fileData) => {
					saveAs(convertBase64ToFile(fileData.content, checkedFile.name));
				});
			});
		}

		if (
			id === FilesListControlName.DELETE &&
			tableData !== null &&
			tableData.checkedFilesList.length !== 0
		) {
			const deleteFileRequestsQueue = tableData.checkedFilesList.map(
				(checkedFile) => {
					return deleteUserParameterFileFx({
						userId,
						fileId: checkedFile.id,
						moduleName: ModuleName.FilesList_deleteUserParameterFileFx,
					});
				},
			);

			Promise.allSettled(deleteFileRequestsQueue).then(handleUpdateParameter);
		}
	};

	const handleUploadFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();

		const attachedFiles = e.currentTarget.files;

		if (attachedFiles !== null) {
			for (let i = 0; i < attachedFiles.length; i += 1) {
				const reader = new FileReader();

				reader.onload = () => {
					saveUserParameterValueFx({
						userId,
						unitId: unit.itemNumber,
						parameterId: parameter.id,
						valueId: parameter.valueId,
						value: parameter.value as string,
						fileId: null,
						fileBinaryData:
							typeof reader.result === 'string'
								? reader.result.split(',')[1]
								: '',
						fileName: attachedFiles[i].name,
						valueLastModified: parameter.valueLastModified,
						moduleName: ModuleName.FilesList_saveUserParameterValueFx,
					}).then(handleUpdateParameter);
				};

				reader.readAsDataURL(attachedFiles[i]);
			}
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<p className={styles.title}>Список файлов</p>
				<div className={styles.controls_block}>
					<Divider className={styles.divider} />
					{viewMode === 'read' ? (
						<Button
							id={FilesListControlName.DOWNLOAD}
							className={styles.control}
							disabled={
								tableData === null ||
								(tableData !== null && tableData.checkedFilesList.length === 0)
							}
							onClick={handleControlClick}
						>
							<Download className={styles.icon} />
							Скачать отмеченные
						</Button>
					) : null}
					{viewMode === 'edit' ? (
						<>
							<UploadFile
								id={String(parameter.id)}
								className={styles.file_upload}
								icon={<SymbolPlus className={styles.icon__distanced} />}
								title="Добавить новый"
								acceptedTypes={acceptedFileTypes}
								onChange={handleUploadFileChange}
							/>
							<Button
								id={FilesListControlName.DELETE}
								className={styles.control}
								disabled={
									tableData === null ||
									(tableData !== null &&
										tableData.checkedFilesList.length === 0)
								}
								onClick={handleControlClick}
							>
								<BasketFirst className={styles.icon} />
								Удалить отмеченные
							</Button>
						</>
					) : null}
				</div>
			</div>
			{tableData !== null ? (
				<DataTable
					headerData={tableData.header}
					bodyData={tableData.body}
					bodyClassName={styles.table_body}
					orientation="row"
				/>
			) : null}
		</div>
	);
}

export default FilesList;
