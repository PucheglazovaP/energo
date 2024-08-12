export default function getFileExtension(file: string) {
	const [extension] = file.split('.').reverse();
	return extension.toLowerCase();
}
