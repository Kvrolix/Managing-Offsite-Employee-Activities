export const formatDateTime = (isoString) => {
	const date = new Date(isoString);
	const time = date.toLocaleTimeString('en-UK', { hour: 'numeric', minute: '2-digit' });
	const dateFormatted = date.toLocaleDateString('en-UK');
	return `${time} on ${dateFormatted}`;
};

// helpers.js
