/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import clsx from 'clsx';

import MarkerCheckbox from './MarkerCheckbox';
import MarkerRadio from './MarkerRadio';
import MarkerSwitcher from './MarkerSwitcher';
import { SwitcherProps } from './types';

import './Switcher.css';

function selectMarker(
	type: 'checkbox' | 'radio' | 'switcher',
	className?: string,
): (checked: boolean) => JSX.Element {
	const markerView = {
		checkbox: (checked: boolean) => {
			return <MarkerCheckbox className={className} checked={checked} />;
		},
		radio: (checked: boolean) => {
			return <MarkerRadio checked={checked} />;
		},
		switcher: (checked: boolean) => {
			return <MarkerSwitcher checked={checked} />;
		},
	};
	return markerView[type];
}

/**
 * Универсальный компонент переключатель.
 *
 * Для изменения поведения переключателя используется
 * атрибут `type`, который принимает один из аргументов:
 *
 * - `checkbox` — каждый из связных компонентов выбирается независимо
 * - `radio` — выбирается только один компонент из связных элементов
 *
 * Для связки элементов друг с другом нужно указать
 * одинаковое значение атрибута `name`.
 *
 * По умолчанию для типа `checkbox` маркер выводится ввиде прямоугольника
 * с галкой внутри; для `radio` ввиде круга с точкой внутри. Чтобы изменить
 * вид маркера нужно передать соответствующий компонент в аргументе
 * `MarkerComponent`.
 *
 * `MarkerComponent` обязательно должен реализовывать атрибут `checked`
 */
function Switcher(props: SwitcherProps) {
	const {
		id,
		name,
		type = 'checkbox',
		checked,
		disabled,
		caption,
		value,
		className,
		glyphClassName,
		markerRenderFn,
		onChange,
	} = props;
	const renderMarker = markerRenderFn || selectMarker(type, glyphClassName);

	const switcherClassName = clsx(['switcher', className]);

	const getInputType = (type: 'checkbox' | 'radio' | 'switcher') => {
		switch (type) {
			case 'radio':
				return 'radio';
			case 'checkbox':
			case 'switcher':
			default:
				return 'checkbox';
		}
	};

	return (
		<label className={switcherClassName}>
			<input
				id={id}
				type={getInputType(type)}
				name={name}
				className="switcher__input a11y_hidden"
				checked={checked}
				disabled={disabled}
				value={value}
				onChange={onChange}
				readOnly={!onChange}
			/>
			{renderMarker(checked)}
			{caption && <span className="switcher__label">{caption}</span>}
		</label>
	);
}

export default React.memo(Switcher);
