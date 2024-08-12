import {
	History,
	HistoryChangesListResponse,
	HistoryElementStatus,
	HistoryElementType,
	HistoryResponse,
} from './types';

/**
 * Converts response data to the data compatible with store
 * Used for general history as well as for any element type
 */
export function convertHistory(response: HistoryResponse[]) {
	const result: History[] = response.map((item) => {
		return {
			itemType:
				item.ItemType !== undefined
					? (HistoryElementType[
							item.ItemType
					  ] as keyof typeof HistoryElementType)
					: undefined,
			id: item.Number,
			name: item.Name,
			user: item.ACC_NAME,
			validFrom: item.ValidFrom,
			validTo: item.ValidTo,
			lastModifiedId: item.LastModified,
			status: HistoryElementStatus[item.Oper],
			isCollapsed: false,
			moduleName: item.Module_name,
			changesList: item.ChangesList
				? JSON.parse<HistoryChangesListResponse[]>(item.ChangesList).map(
						(el) => {
							return {
								name: el.ParamName,
								prev: el.PrevValue,
								next: el.CurValue,
							};
						},
				  )
				: [],
		};
	});
	return result;
}
