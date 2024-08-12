import { InputFormHeader } from '../../Models/InputFormHeader/types';
import { PointLogBookHeaderListResponse } from '../../Models/PointsLogBook/types';
import { BackendResponse } from '../../Shared/types';

export function fetchPointLogBookHeaderListAdapter(
	response: string,
): InputFormHeader[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as PointLogBookHeaderListResponse[];
	const pointLogBookHeader: InputFormHeader[] = data.map((param) => ({
		id: param.ID,
		order: param.FieldOrder,
		name: param.FieldDatasetName,
		title: param.FieldTitle,
		minWidth: param.FieldMinWidth,
		maxWidth: param.FieldMaxWidth,
		fieldAlign: param.FieldAlign,
		fixed: param.FieldFixed,
		type: param.FieldType,
		isParentVisible: Boolean(param.IsParentVisible),
		parentOrder: param.ParentGroupOrder,
		parentTitle: param.ParentTitle,
		parentMinWidth: param.ParentMinWidth,
		parentMaxWidth: param.ParentMaxWidth,
		comment: null,
		additionalFieldName: null,
	}));

	return pointLogBookHeader;
}
