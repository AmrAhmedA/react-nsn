export function timeSince(date: Date) {
	const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

	let interval = seconds / 31536000;

	if (interval > 1) {
		return Math.floor(interval) + " years";
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		return Math.floor(interval) + " months";
	}
	interval = seconds / 86400;
	if (interval > 1) {
		return Math.floor(interval) + " days";
	}
	interval = seconds / 3600;
	if (interval > 1) {
		return Math.floor(interval) + " hours";
	}

	interval = seconds / 60;

	if (interval > 2) {
		return Math.floor(interval) + " minutes";
	}

	if (interval > 1) {
		return Math.floor(interval) + " minute";
	}

	return Math.floor(seconds) + " seconds";
}

export const DEFAULT_POLLING_URL = "https://www.gstatic.com/generate_204";
