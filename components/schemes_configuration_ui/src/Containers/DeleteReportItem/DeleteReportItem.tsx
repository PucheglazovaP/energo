import { Delete } from '../../UI/Confirmation';

import { useDeleteReportItem } from './useDeleteReportItem';

const TITLE =
	'Вы действительно хотите удалить позицию и ее потомков (если имеются)?';

function DeleteReportItem() {
	const { handleCloseModal, handleConfirmDelete } = useDeleteReportItem();

	return (
		<Delete
			title={TITLE}
			onClose={handleCloseModal}
			onDelete={handleConfirmDelete}
		/>
	);
}

export default DeleteReportItem;
