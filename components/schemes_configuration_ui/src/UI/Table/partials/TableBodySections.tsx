import { ReactElement } from 'react';

import { DEFAULT_SECTION_BODY_MULTIPLIER } from '../constants';
import {
	ITableBody,
	TableBodySectionsProps,
	TableSectionProps,
} from '../types';

import TableBody from './TableBody';
import TableSection from './TableSection';

function TableBodySections({
	headers,
	sections,
	data,
	handleExpandCollapse,
}: TableBodySectionsProps) {
	// Разбить данные в зависимости от секции, к которой они принадлежат
	const sectionsData = data.reduce(
		(accumulator: Record<string, ITableBody[]>, item) => {
			if (item.sectionAccessor) {
				if (!accumulator[item.sectionAccessor]) {
					accumulator[item.sectionAccessor] = [];
				}

				accumulator[item.sectionAccessor].push(item);
			}

			return accumulator;
		},
		{},
	);

	// Подготовить многоуровневый рендер элементов
	const { elements: sectionsRender } = sections.reduce(
		(
			accumulator: {
				elements: ReactElement<TableSectionProps>[]; // Список элементов для рендера
				refs: Record<string, ReactElement<TableSectionProps>>; // Словарь для работы с элементами
				depthLevel: Record<string, number>; // Словарь для счета уровня вложенности каждого элемента
			},
			section,
		) => {
			const { elements, refs, depthLevel } = accumulator;

			// Рассчитать уровень вложенности для текущего элемента
			if (section.parentAccessor && refs[section.parentAccessor]) {
				// Если это дочерняя секция, проставляем ей уровень +1 к родительскому
				// родительской может быть другая дочерняя секция
				// которая может иметь уровень отличный от 0
				depthLevel[section.sectionAccessor] =
					depthLevel[section.parentAccessor] + 1;
			} else {
				// Если это главная родительская секция, которая не является дочерней
				depthLevel[section.sectionAccessor] = 0;
			}
			// Считываем текущей уровень вложенности для секции
			const itemDepth = depthLevel[section.sectionAccessor];

			if (!refs[section.sectionAccessor]) {
				refs[section.sectionAccessor] = (
					<TableSection
						key={section.sectionAccessor}
						accessor={section.sectionAccessor}
						colSpan={headers.length}
						level={itemDepth}
						title={section.text}
						isExpanded={section.isExpanded}
						handleExpandCollapse={handleExpandCollapse}
						renderSection={section.renderSection}
						onContextMenu={section.onContextMenu}
						className={section.className}
					>
						{[]}
					</TableSection>
				);
			}

			// Если это дочерняя секция и существует родительская
			if (section.parentAccessor && refs[section.parentAccessor]) {
				// Является ли данная секция последней и нее имеет дочерних
				const isSectionOnTheLastLevel = sections.every(
					(item) => item.parentAccessor !== section.sectionAccessor,
				);

				if (isSectionOnTheLastLevel) {
					// Если у секции нет дочерних, помещаем в нее данные, которые к ней относятся
					refs[section.sectionAccessor].props.children.push(
						<TableBody
							key={`data-${section.sectionAccessor}`}
							headers={headers}
							data={sectionsData[section.sectionAccessor] || []}
							depthLevel={itemDepth + DEFAULT_SECTION_BODY_MULTIPLIER}
							isDotVisible
						/>,
					);
				}

				// Помещаем подготовленную секцию внутрь родительской с помощью словаря
				// и факта, что работа идет с объектом, через ссылку на объект
				refs[section.parentAccessor].props.children.push(
					refs[section.sectionAccessor],
				);
			} else if (!section.parentAccessor) {
				// Если секция не имеет родителя, то помещаем ее в список для отрисовки
				// Внутри через ссылку на объект будут заполнены все дочерние элементы
				elements.push(refs[section.sectionAccessor]);

				if (
					sections.every(
						(item) => item.parentAccessor !== section.sectionAccessor,
					)
				) {
					refs[section.sectionAccessor].props.children.push(
						<TableBody
							key={`data-${section.sectionAccessor}`}
							headers={headers}
							data={sectionsData[section.sectionAccessor] || []}
							depthLevel={itemDepth + DEFAULT_SECTION_BODY_MULTIPLIER}
							isDotVisible
						/>,
					);
				}
			}

			return accumulator;
		},
		{ elements: [], refs: {}, depthLevel: {} },
	);

	return <>{sectionsRender}</>;
}

export default TableBodySections;
