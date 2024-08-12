import { Image } from '../Models/ImagesCollection/types';
import { UploadImageResponse } from '../Shared/types';

export function uploadImageAdapter(body: string): Image {
	const resp: UploadImageResponse = JSON.parse(body).Response.Tables[0].Rows[0];
	return {
		id: resp.SKEY,
		binary: resp.BINARY_FILE,
	} as Image;
}
