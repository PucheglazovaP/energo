import clsx from 'clsx';
import { useStore } from 'effector-react';

import PicturesDynamicObjectAdapter from '../../Adapters/SetPicturesDynamicObject/InformationAboutBannersAdapter';
import { $informationPictures } from '../../Models/PicturesDynamicObject';

import IndicatorIcon from './IndicatorIcon';
import ModalClose from './ModalClose';
import SetPicturesDynamicObjectRender from './SetPicturesDynamicObjectRender';
import { SetPicturesDynamicProps } from './types';
import { usePicturesDynamic } from './unit';

import styles from './SetPicturesDynamicObject.module.css';

function SetPicturesDynamicObject({
	className,
	style,
	codeForm,
	codeObject,
	nameParameter,
}: SetPicturesDynamicProps) {
	usePicturesDynamic(codeForm, codeObject, nameParameter);

	const dataInformation = useStore($informationPictures);

	let data: Array<[]> = [];
	if (Array.isArray(dataInformation)) {
		data = dataInformation;
	} else {
		data;
	}

	const adaptedData = PicturesDynamicObjectAdapter(data);

	return (
		<div className={clsx(styles.root, className)} style={style}>
			<div className={clsx(styles.data_location)}>
				<div>
					<h1 className={clsx(styles.data_location_h1)}>
						Набор картинок динамического объекта
					</h1>
					<div className={clsx(styles.data_location_file)}>
						<IndicatorIcon />
						<p className={clsx(styles.data_location_p)}>
							Файл картинки отсутствует в папке Наименование
						</p>
					</div>
				</div>
				<ModalClose />
			</div>
			<div className={clsx(styles.column_names)}>
				<div className={clsx(styles.column_number)}>№</div>
				<div className={clsx(styles.column_name)}>Наименование</div>
				<div className={clsx(styles.column_comment)}>Комментарий</div>
				<button className={clsx(styles.column_button)}>Добавить +</button>
			</div>
			<div className={clsx(styles.rendering_list)}></div>
			<SetPicturesDynamicObjectRender data={adaptedData} />
		</div>
	);
}
export default SetPicturesDynamicObject;
