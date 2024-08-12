import { InputFormHeader } from '../../Models/InputFormHeader/types';
import { BackendResponse, InputFormHeaderResponse } from '../../Shared/types';

export function inputFormHeaderAdapter(response: string): InputFormHeader[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as InputFormHeaderResponse[];
	const header = data.map((item) => ({
		id: item.ID,
		order: item.FieldOrder,
		name: item.FieldDatasetName,
		title: item.FieldTitle,
		minWidth: item.FieldMinWidth,
		maxWidth: item.FieldMaxWidth,
		fixed: item.FieldFixed,
		type: item.FieldType,
		isParentVisible: item.IsParentVisible,
		parentOrder: item.ParentGroupOrder,
		parentTitle: item.ParentTitle,
		parentMinWidth: item.ParentMinWidth,
		parentMaxWidth: item.ParentMaxWidth,
		additionalFieldName: item.BottomFieldDatasetName,
		comment: item.FieldComment,
	}));
	return header;
}
