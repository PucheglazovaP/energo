import { useEffect } from 'react';

import { fetchInfoAboutTransparentsFx } from '../../Models/InformationAboutBanners/effects';

export function useInformation(
	codeForm: number | null,
	codeVersion: number | null,
) {
	useEffect(() => {
		fetchInfoAboutTransparentsFx({
			codeForm: codeForm,
			codeVersion: codeVersion,
		});
	}, []);
}
