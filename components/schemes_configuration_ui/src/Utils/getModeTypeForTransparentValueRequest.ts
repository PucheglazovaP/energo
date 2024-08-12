export default function getModeTypeForTransparentValueRequest(
	showDataType: number,
) {
	switch (showDataType) {
		case 0:
			return 3;
		case 101:
			return 7;
		case 102:
			return 6;
		case 201:
			return 11;
		case 202:
			return 10;
		case 301:
			return 9;
		case 302:
			return 8;
	}
}
