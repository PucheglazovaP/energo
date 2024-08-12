import { Delete } from '../../UI/Confirmation';

import { useDeletePrintForm } from './useDeletePrintForm';

const TITLE = 'Вы действительно хотите удалить форму?';

function DeletePrintForm() {
	const { handleCloseModal, handleConfirmDelete } = useDeletePrintForm();

	return (
		<Delete
			title={TITLE}
			onClose={handleCloseModal}
			onDelete={handleConfirmDelete}
		/>
	);
}

export default DeletePrintForm;
