import { FormTypes, TypesStorage } from '../../Shared/types';
import { TreeItem } from '../../UI/Tree/types';

export interface FormTreeItem extends TreeItem {
	formType: FormTypes;
	hasOwner: boolean;
	canEdit: boolean;
	typesStorage: TypesStorage;
}

export type FormTreeDataResponse = {
	tree: FormTreeItem[];
	diagnosticId: number;
};
