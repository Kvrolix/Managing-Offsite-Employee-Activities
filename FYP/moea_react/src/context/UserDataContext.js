// UserDataContext.js
import React, { createContext, useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';

// Create a context for the user data
export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);
	const [usersByOrganization, setUsersByOrganization] = useState(null);
	const [userRecord, setUserRecord] = useState(null);

	const fetchUserRecord = async (userId) => {
		try {
			// BUG
			let { data: userRecord, error } = await supabase.from('users2').select('*').eq('authid', userId); // Assuming there is only one record for each user
			console.log(`UserdataContext:`, userRecord);

			if (error) {
				throw error;
			}

			return userRecord;
		} catch (error) {
			console.error('Error fetching user record:', error.message);
			return null; // or you could throw an error to be caught by the calling code
		}
	};

	useEffect(() => {
		const fetchUserData = async () => {
			const currentUser = await supabase.auth.getUser();

			if (currentUser.data?.user) {
				setUser(currentUser.data.user); // Set the authenticated user's information

				try {
					// Fetch the custom user record using the authenticated user's ID
					const record = await fetchUserRecord(currentUser.data.user.id);
					setUserRecord(record); // Set the fetched custom user record
				} catch (fetchError) {
					setError(fetchError.message); // Set any errors encountered during fetching
				}
			}
		};

		fetchUserData();
	}, []);

	/////////////////////////////////////////////////////////////////////

	// useEffect(() => {
	// 	const fetchUserData = async () => {
	// 		// Use supabase.auth.user() directly, not as a function
	// 		const currentUser = supabase.auth.getUser();

	// 		if (currentUser) {
	// 			setUser(currentUser); // Set the authenticated user's information
	// 			try {
	// 				// Fetch the custom user record using the authenticated user's ID
	// 				const recordInput = (await currentUser).data.user.id;
	// 				const record = await fetchUserRecord(recordInput);
	// 				setUserRecord(record); // Set the fetched custom user record
	// 			} catch (fetchError) {
	// 				setError(fetchError.message); // Set any errors encountered during fetching
	// 			}
	// 		}
	// 	};

	// 	fetchUserData();
	// }, []);
	// useEffect(() => {
	// 	async function getUserData() {
	// 		await supabase.auth.getUser().then((value) => {
	// 			//  value.data.user
	// 			if (value.data?.user) {
	// 				console.log(value.data.user);
	// 				setUser(value.data.user);
	// 			}
	// 		});
	// 	}
	// 	getUserData();
	// }, []);

	/////////////////////////////////////////////////////////////////////

	// useEffect(() => {
	// 	async function getUserRecord() {
	// 		await supabase.auth.getUserRecord('users2').then((value) => {
	// 			if (value.data?.userRecord) {
	// 				console.log('User Record');
	// 				setUserRecord(value.data.userRecord);
	// 			}
	// 		});
	// 	}
	// 	getUserRecord();
	// }, []);

	// useEffect(() => {
	// 	async function getUserDetailsAndRecord() {
	// 		try {
	// 			// First, get the authenticated user's details
	// 			let { user, error: authError } = supabase.auth.user();

	// 			if (authError) throw authError;

	// 			if (user) {
	// 				console.log(user);
	// 				// Then, use the user ID to fetch the related record from 'users2' table
	// 				let { data: userRecord, error: recordError } = await supabase
	// 					.from('users2')
	// 					.select('*')
	// 					.eq('id', user.id) // Assuming 'id' in 'users2' table is a foreign key to the auth users table
	// 					.single();

	// 				if (recordError) throw recordError;

	// 				console.log('User Record', userRecord);
	// 				setUserRecord(userRecord); // Make sure you have a setUserRecord state updater function
	// 			}
	// 		} catch (error) {
	// 			console.error('Error fetching user details and record:', error.message);
	// 			// Handle the error appropriately here
	// 		}
	// 	}
	// 	getUserDetailsAndRecord();
	// }, []);

	// useEffect(() => {
	// 	const fetchUserData = async () => {
	// 		const { data, error } = await supabase.auth.getUser();
	// 		if (error) setError(error);
	// 		if (data) setUser(data);
	// 	};

	// 	fetchUserData();
	// }, []);

	// It works

	return <UserDataContext.Provider value={{ user, userRecord, error }}>{children}</UserDataContext.Provider>;
};
