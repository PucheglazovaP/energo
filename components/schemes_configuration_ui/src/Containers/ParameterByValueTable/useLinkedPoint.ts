import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';

import { closeModal } from '../../Models/Modal/events';
import { $parameterByValueTable } from '../../Models/ParametersByValueReports';
import { $points } from '../../Models/Points';
import { setFocusPointId } from '../../Models/Points/events';
import { Point } from '../../Models/Points/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { Path } from '../../Shared/types';

function useLinkedPoint() {
	const points: Point[] = useStore($points);
	const { modalLinkedPointId } = useStore($parameterByValueTable);
	const navigate = useNavigate();

	// Переход к Базовой точке учета
	const handleLinkedPointRedirectClick = useCallback(() => {
		closeModal(RegisteredModals.LinkedPointModal);
		setFocusPointId(modalLinkedPointId);
		navigate(Path.ReportByPoints);
	}, [modalLinkedPointId]);

	const {
		shortName,
		name,
		comment,
		channelNumber,
		channelName,
		deviceNumber,
		deviceName,
		coefficient,
		linkedPointId,
	} = points[0];

	// Значения параметров Связанной точки учета
	const point = [
		shortName,
		name,
		comment,
		channelNumber ? 'Да' : 'Нет',
		channelNumber,
		channelName,
		deviceNumber,
		deviceName,
		coefficient,
		linkedPointId ? 'Да' : 'Нет',
	];

	return { point, handleLinkedPointRedirectClick };
}
export default useLinkedPoint;
