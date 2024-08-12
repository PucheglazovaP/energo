// import { InformationBannersProps } from '../../Containers/InformationAboutBanners/types';

import { InformationBanners } from '../../Containers/InformationAboutBanners/types';

export default function InformationAboutBannersAdapter(data: any) {
	return data.map((item: any) => ({
		keyTransparency: item.КлючТранспаранта || '',
		dataSUBD: item.ДанныеИзСУБД,
		dataGroup: item.ГруппаДанных,
		eWork: item.НомерEWorkГруппыДанных,
		numberGD: item.НомерГруппыДанных,
		codeTransparency: item.КодТранспаранта,
	}));
}
export function tableDataExcelAdapter(data: InformationBanners[]) {
	return data.map((item) => ({
		codeTransparency: item.codeTransparency,
		dataGroup: item.dataGroup || '',
		dataSUBD: item.dataSUBD ? '+' : '-',
		eWork: item.eWork != null ? item.eWork : '',
		keyTransparency: item.keyTransparency,
		numberGD: item.numberGD != null ? item.numberGD : '',
	}));
}
