export type FavouriteLogOperationType = {
	info: [{ Number: number; LastModified: string }];
};
export interface BackendResponse {
	Response: {
		Error: unknown;
		OutParameters: {
			'@PageNumber': string;
			'@FirstRow': string;
			'@PageTotalCount': string;
			'@Err': string;
			TextErr: string;
			'@ReturnValue': string;
			[key: string]: string;
		}[];
		PrintOutput: string;
		Tables: { Rows: unknown; Structure: unknown }[];
	};
}
