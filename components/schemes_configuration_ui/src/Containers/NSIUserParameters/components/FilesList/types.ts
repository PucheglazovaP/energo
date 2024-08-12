import { NSISelectedUnit } from '../../../../Models/NSISelectedUnit/types';
import { NSIUserParameter } from '../../../../Models/NSIUserParameters/types';
import { UserId } from '../../../../Shared/types';

export const enum FilesListControlName {
	DOWNLOAD = 'files-list-download',
	ADD = 'files-list-add',
	DELETE = 'files-list-delete',
}

export interface FilesListProps extends UserId {
	unit: NSISelectedUnit;
	viewMode: 'read' | 'edit';
	parameter: NSIUserParameter;
}
