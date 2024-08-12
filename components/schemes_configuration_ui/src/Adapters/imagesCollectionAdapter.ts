import { Image } from '../Models/ImagesCollection/types';
import { ImagesCollectionResponse } from '../Shared/types';

export function imagesCollectionAdapter(response: string) {
	const rows: ImagesCollectionResponse[] =
		JSON.parse(response).Response.Tables[0].Rows;
	const list: Image[] = rows.map((row) => ({
		id: row.SKEY,
		name: row.NAME,
		binary: row.BINARY_FILE,
	}));
	return list;
}
