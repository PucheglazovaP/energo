export default function convertValue(value: string, dataType: string) {
	switch (dataType) {
		case 'Boolean': {
			if (value === 'true' || value === 'false')
				return value === 'true' ? 1 : 0;
			return Number(value);
		}
		case 'Integer': {
			return Number(value);
		}
		default: {
			return value;
		}
	}
}

/**
 * calculate Y-axis value of the element
 */
export function calculateY(value: number | null, coef: number, round: number) {
	const y: number | null =
		value != null ? Number((value * coef).toFixed(round)) : null;
	return y;
}
