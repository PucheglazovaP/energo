import { FormTreeItem } from '../Models/TreeForms/types';
import { FORM_TYPES } from '../Shared/const';
import {
	BackendResponse,
	FormTypes,
	TreeResponse,
	TYPES_STORAGE_LIST,
} from '../Shared/types';

export default function treeFormDataAdapter(result: string): {
	tree: FormTreeItem[];
	diagnosticId: number;
} {
	const message: BackendResponse = JSON.parse(result);
	const treeResponse = message.Response.Tables[0].Rows as TreeResponse[];
	const diagnosticId: number = Number(
		message.Response.OutParameters[0]['@КодФормыДиагностики'],
	);

	const tree: FormTreeItem[] = treeResponse.map((item) => {
		const formType = FORM_TYPES.find((type) => type.id === item.НомерТипаФормы);
		return {
			id: item.КодФормы,
			order: item.НомерПоПорядку || 1,
			parentId: item.КодРодительскойФормы || undefined,
			displayName: item.НазваниеФормы || '',
			name: item.НазваниеФормы || '',
			formType: formType?.name || FormTypes.Form,
			isLast: !item.ЕстьПотомки,
			hasOwner: !!item.HasOwner,
			canEdit: !!item.CanEdit,
			typesStorage: item.FK_TypesStorage
				? TYPES_STORAGE_LIST[item.FK_TypesStorage]
				: TYPES_STORAGE_LIST[0],
		};
	});

	return {
		diagnosticId,
		tree,
	};
}
