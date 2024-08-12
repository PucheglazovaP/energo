import React from 'react';

interface CheckboxProps {
	visible: boolean;
	onChange?: (visible: boolean) => void;
	color: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ visible, onChange, color }) => {
	const toggleVisible = () => {
		onChange && onChange(!visible);
	};

	const checkboxStyle: React.CSSProperties = {
		fill: visible ? color : 'transparent',
		stroke: color,
		strokeWidth: 2,
		strokeLinecap: 'round',
		strokeLinejoin: 'round',
		transition: 'fill 0.2s',
		cursor: 'pointer',
	};

	return (
		<svg width={16} height={16} onClick={toggleVisible}>
			<rect
				x={1}
				y={1}
				width={14}
				height={14}
				style={{ stroke: '#CCCCCC', strokeWidth: 2, fill: 'transparent' }}
			/>
			<rect x={1} y={1} width={14} height={14} style={checkboxStyle} />
		</svg>
	);
};
export default Checkbox;
