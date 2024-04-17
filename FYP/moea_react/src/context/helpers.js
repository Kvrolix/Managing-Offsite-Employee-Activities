export const formatDateTime = (isoString) => {
	const date = new Date(isoString);
	const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
	const dateFormatted = date.toLocaleDateString('en-US');
	return `${time} on ${dateFormatted}`;
};

// helpers.js
