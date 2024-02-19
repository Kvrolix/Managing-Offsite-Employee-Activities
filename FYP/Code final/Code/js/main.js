const fetchUsers = async () => {
	try {
		const response = await fetch('/users.json');
		if (!response.ok) {
			throw new Error('HTTP error! status: ${response.status}');
		}
	} catch (e) {
		console.error('Could not fetch users', e.message);
	}
};

fetchUsers();

// function login(username,password) {
//     const user =
// }
