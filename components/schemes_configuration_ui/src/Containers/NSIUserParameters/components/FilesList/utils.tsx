import { MouseEvent } from 'react';
import { Checkbox } from '@evraz/ui-kit';
import { saveAs } from 'file-saver';

import { getUserParameterFileFx } from '../../../../Models/NSIUserParameters/effects';
import {
	setAllFilesCheckedState,
	switchFileCheckedState,
} from '../../../../Models/NSIUserParameters/events';
import { NSIUserParameterFilesListItem } from '../../../../Models/NSIUserParameters/types';
import { ModuleName } from '../../../../Shared/Types/moduleName';
import { AcceptanceTypes } from '../../../../UI/UploadFile/types';
import { DataTableCell, TableDataItem } from '../DataTable/types';

import styles from './FilesList.module.css';

export const acceptedFileTypes = [
	AcceptanceTypes.bmp,
	AcceptanceTypes.gif,
	AcceptanceTypes.jpeg,
	AcceptanceTypes.png,
	AcceptanceTypes.pdf,
	AcceptanceTypes.doc,
	AcceptanceTypes.docx,
	AcceptanceTypes.xls,
	AcceptanceTypes.xlsx,
];

export function convertBase64ToFile(
	base64String: string,
	fileName: string,
): File {
	const bytesStr = atob(base64String);

	const uintArray = new Uint8Array(bytesStr.length);

	for (let i = 0; i < uintArray.length; i += 1) {
		uintArray[i] = bytesStr.charCodeAt(i);
	}

	const file = new File([uintArray], fileName, { type: '' });

	return file;
}

export function getTableData(
	files: NSIUserParameterFilesListItem[],
	userId: string,
	valueId: number,
): {
	header: DataTableCell[];
	body: TableDataItem[];
	checkedFilesList: NSIUserParameterFilesListItem[];
} {
	const checkedFilesList = files.filter((file) => {
		return file.checked;
	});
	const checkedFilesCount = checkedFilesList.length;

	const header: DataTableCell[] = [
		{
			cellId: 'files-list-control-header-cell',
			cellClassName: styles.table_cell__control,
			content: (
				<Checkbox
					className={
						checkedFilesCount !== 0 && files.length !== checkedFilesCount
							? styles.checkbox__semi_checked
							: styles.checkbox
					}
					isChecked={files.length === checkedFilesCount}
					onChange={() => {
						setAllFilesCheckedState({
							valueId,
							checked: files.length !== checkedFilesCount,
						});
					}}
				/>
			),
		},
		{
			cellId: 'files-list-name-header-cell',
			cellClassName: styles.table_cell__wide,
			content: 'Наименование',
		},
		{
			cellId: 'files-list-date-header-cell',
			cellClassName: styles.table_cell,
			content: 'Дата загрузки',
		},
	];

	const handleDownloadFileClick = (e: MouseEvent<HTMLButtonElement>) => {
		const { id, value: fileName } = e.currentTarget;

		getUserParameterFileFx({
			userId,
			fileId: Number(id),
			moduleName: ModuleName.FilesList_utils_getUserParameterFileFx,
		}).then((fileData) => {
			saveAs(convertBase64ToFile(fileData.content, fileName));
		});
	};

	const body: TableDataItem[] = files.map((file) => {
		return {
			columnId: `${file.id}--${file.uploadDate}`,
			cells: [
				{
					cellId: `files-list-table-row`,
					cellClassName: styles.table_row,
					content: (
						<>
							<Checkbox
								className={styles.checkbox__extended}
								isChecked={file.checked}
								onChange={() => {
									switchFileCheckedState({
										valueId,
										fileId: file.id,
									});
								}}
							/>
							<button
								id={String(file.id)}
								className={styles.file_link}
								value={file.name}
								type="button"
								onClick={handleDownloadFileClick}
							>
								{file.name}
							</button>
							<p className={styles.upload_date}>{file.uploadDate}</p>
						</>
					),
				},
			],
		};
	});

	return {
		header,
		body,
		checkedFilesList,
	};
}
