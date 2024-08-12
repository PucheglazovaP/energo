export default function isNumber(testValue: string) {
	return !Number.isNaN(Number(testValue));
}
