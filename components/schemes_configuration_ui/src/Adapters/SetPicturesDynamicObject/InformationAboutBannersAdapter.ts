// import { InformationBannersProps } from '../../Containers/InformationAboutBanners/types';

export default function PicturesDynamicObjectAdapter(data: any) {
	return data.map((item: any) => ({
		serialNumber: item.ПорядковыйНомер,
		meaning: item.Значение,
		comment: item.Комментарий,
		Err: item.Err,
	}));
}
