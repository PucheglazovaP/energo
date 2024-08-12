import { InputFormPointsHeader } from '../../Models/InputFormPointsHeader/types';
import {
	BackendResponse,
	InputFormPointsHeaderResponse,
} from '../../Shared/types';

export function inputFormPointsHeaderAdapter(
	response: string,
): InputFormPointsHeader[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as InputFormPointsHeaderResponse[];
	const header = data.map((item) => ({
		id: item.ID,
		order: item.FieldOrder,
		name: item.FieldDatasetName,
		title: item.FieldTitle,
		minWidth: item.FieldMinWidth,
		maxWidth: item.FieldMaxWidth,
		fixed: item.FieldFixed,
		type: item.FieldType,
		isEditable: item.IsEditable,
		isParentVisible: item.IsParentVisible,
		parentOrder: item.ParentGroupOrder,
		parentTitle: item.ParentTitle,
		parentMinWidth: item.ParentMinWidth,
		parentMaxWidth: item.ParentMaxWidth,
		pointId: item.FK_DailyPoints,
	}));
	return header;
}
