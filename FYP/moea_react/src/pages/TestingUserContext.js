// TestingUserContext.js
import React, { useContext, useEffect } from 'react';
import { UserDataContext } from '../context/UserDataContext'; // Adjust the path to point to your UserDataContext file

const TestingUserContext = () => {
	const { user, error } = useContext(UserDataContext); // Accessing context values

	useEffect(() => {
		// Effect for doing something when user or error changes
		if (error) {
			console.error(error);
		}
		if (user) {
			// console.log('User from context:', user);
			// Perform any action based on the user data
		}
	}, [user, error]);

	return (
		<div>
			{error && <p>Error: {error.message}</p>}
			{user ? <p>Welcome, {user.email}</p> : <p>Loading user data...</p>}
		</div>
	);
};

export default TestingUserContext;
