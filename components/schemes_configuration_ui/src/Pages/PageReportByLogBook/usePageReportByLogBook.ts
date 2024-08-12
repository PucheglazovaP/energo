import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useStore } from 'effector-react';

import { openModal } from '../../Models/Modal/events';
import { fetchReportLinkListFx } from '../../Models/Report/effects';
import { $datePeriod } from '../../Models/ReportsTechnical';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ReportLinkType } from '../../Shared/Types/report';
import { getReportUrl } from '../../Utils/reportUrl';

function usePageReportByLogBook(energyResourceId: number) {
	const { startDate, endDate } = useStore($datePeriod);
	const [reportLInk, setUrl] = useState('');
	const url: string = useMemo(() => {
		const resultUrl = getReportUrl({
			path: reportLInk,
			fromDate: format(startDate, 'dd.MM.yyyy'),
			toDate: format(endDate, 'dd.MM.yyyy'),
			id: energyResourceId,
		});

		return resultUrl;
	}, [energyResourceId, endDate, startDate, reportLInk]);

	// Колбэк для кнопки редактирования формы
	const handleOpenModal = useCallback(() => {
		// TODO когда будет готов бек - сделать вариант с сессиями
		openModal(RegisteredModals.EditLogBook);
	}, []);

	useEffect(() => {
		fetchReportLinkListFx(ReportLinkType.UGELogBook).then((url) => {
			const result = decodeURI(url).split('&')[0];
			setUrl(result);
		});
	}, []);

	return { url, handleOpenModal };
}

export default usePageReportByLogBook;
