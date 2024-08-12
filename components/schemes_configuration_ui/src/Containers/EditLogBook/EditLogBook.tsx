import { Button } from '@evraz/ui-kit';

import Select from '../../UI/Select';
import Table from '../../UI/Table';

import useEditLogBook from './useEditLogBook';

import styles from './EditLogBook.module.css';

function EditLogBook() {
	const {
		inputFormHeader,
		renderSupComponent,
		tableData,
		renderColGroupComponent,
		handleCloseModal,
		energyResourceName,
		isSelectorDisabled,
		selectOptions,
		handleSelectPoint,
		isLoading,
	} = useEditLogBook();

	return (
		<div className={styles.root}>
			<div className={styles.title}>
				<p className={styles.title_text}>{'Редактирование журнала учета'}</p>
				<span className={styles.energy_resource_text}>/</span>
				<p className={styles.energy_resource_text}>{energyResourceName}</p>
			</div>
			<Select
				className={styles.selector}
				options={selectOptions}
				disabled={isSelectorDisabled}
				onSelect={handleSelectPoint}
			/>
			<div className={styles.body}>
				<Table
					className={styles.edit_input_form}
					headers={inputFormHeader}
					data={tableData}
					renderSupHeaderFn={renderSupComponent}
					renderColGroupComponent={renderColGroupComponent}
					isLoading={isLoading}
				/>
			</div>
			<div className={styles.controls}>
				{/* // TODO Пока на беке нет сессий, решили с РП заменить кнопки, 
				но потом заменим обратно. Поэтому не надо удалять эти комменты!  */}
				{/* <Button onClick={handleCloseModal}>Отменить</Button> */}
				{/* <Button onClick={handleCloseModal}>Сохранить</Button> */}
				<Button onClick={handleCloseModal}>Закрыть</Button>
			</div>
		</div>
	);
}

export default EditLogBook;
