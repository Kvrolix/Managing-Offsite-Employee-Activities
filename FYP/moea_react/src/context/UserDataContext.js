// UserDataContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import supabase from '../config/supabaseClient';

// Create a context for the user data
export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);
	// const [usersByOrganization, setUsersByOrganization] = useState(null);
	const [userRecord, setUserRecord] = useState(null); // BUG

	const fetchUserRecord = async (userId) => {
		try {
			let { data: userRecord, error } = await supabase.from('users2').select('*').eq('authid', userId).single();
			console.log(userRecord);
			if (error) throw error;
			setUserRecord(userRecord);
			console.log(`Fetched user record:`, userRecord);
		} catch (error) {
			console.error('Error fetching user record:', error.message);
			setError(error.message);
		}
	};

	useEffect(() => {
		// This function gets called on initial load and on auth state changes
		const checkUserAndFetchData = async () => {
			const session = supabase.auth.session;

			if (session) {
				setUser(session.user);
				await fetchUserRecord(session.user.id);
			}
		};

		checkUserAndFetchData();

		const { data } = supabase.auth.onAuthStateChange((event, session) => {
			if (session) {
			} else {
				// User logged out
				console.log('User logged out');
			}
		});

		// Cleanup function
		return () => {
			if (data && data.subscription) {
				data.subscription.unsubscribe();
			}
		};
	}, []);

	useEffect(() => {
		const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
			if (session && session.user) {
				fetchUserRecord(session.user.id);
			} else {
				console.log('No active session or user from onAuthStateChange.');
			}
		});

		return () => {
			authListener.subscription.unsubscribe();
		};
	}, []);
	const signOutUser = useCallback(async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Error logging out:', error.message);
			setError(error.message);
		} else {
			console.log('User is logged off');
			setUser(null); // Clear user state on logout
			setUserRecord(null); // Optionally clear userRecord if used
		}
	}, []);

	return <UserDataContext.Provider value={{ user, userRecord, error, signOutUser }}>{children}</UserDataContext.Provider>;
};
