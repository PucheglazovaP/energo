import { useEffect } from 'react';

import { fetchInfoAboutDynamicObjectsFx } from '../../Models/DynamicObjects/effects';

export function useInformation(codeForm: number | null, codeVersion: number) {
	useEffect(() => {
		fetchInfoAboutDynamicObjectsFx({
			codeForm: codeForm,
			codeVersion: codeVersion,
		});
	}, []);
}
