export const formatDateTime = (isoString) => {
	const date = new Date(isoString);
	const time = date.toLocaleTimeString('en-UK', { hour: 'numeric', minute: '2-digit' });
	const dateFormatted = date.toLocaleDateString('en-UK');
	return `${time} on ${dateFormatted}`;
};

export const getPositionName = (jobrole) => {
	switch (jobrole) {
		case 1:
			return 'Chief';
		case 2:
			return 'Manager';
		case 3:
			return 'Secretary';
		case 4:
			return 'Team Leader';
		case 5:
			return 'Employee';
		default:
			return 'Unknown';
	}
};

// helpers.js
