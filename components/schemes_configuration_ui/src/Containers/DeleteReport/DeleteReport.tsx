import { Delete } from '../../UI/Confirmation';

import { useDeleteReport } from './useDeleteReport';

const TITLE = 'Вы действительно хотите удалить отчет?';

function DeleteReport() {
	const { handleCloseModal, handleConfirmDelete } = useDeleteReport();

	return (
		<Delete
			title={TITLE}
			onClose={handleCloseModal}
			onDelete={handleConfirmDelete}
		/>
	);
}

export default DeleteReport;
