// UserDataContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import supabase from '../config/supabaseClient';

// Create a context for the user data
export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
	// TODO fetch the jobroles

	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);
	const [employeesForTask, setEmployeesForTask] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [userRecord, setUserRecord] = useState(null); // BUG

	// BUG THIS CAN BE REMOVED? OR COMBINED WITH A FUNCTION BELOW
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

	const fetchUserByAuthId = async (authid) => {
		try {
			let { data: user, error } = await supabase
				.from('users2') // Replace 'users2' with your actual user table name
				.select('*')
				.eq('authid', authid)
				.single(); // Assuming authid is unique and returns a single record

			if (error) throw error;
			return user; // Return the user record
		} catch (error) {
			console.error('Error fetching user by authid:', error.message);
			return null; // Return null or handle error as needed
		}
	};

	const fetchEmployeesForTaskAssignment = async () => {
		try {
			if (!userRecord) return;
			const { data: employees, error } = await supabase.from('users2').select('*').eq('organizationid', userRecord.organizationid).in('jobroleid', [4, 5]);
			if (error) throw error;
			console.log('Employees for task assignment:', employees);
			setEmployeesForTask(employees);
		} catch (error) {
			console.error('Error fetching employees for task assignment:', error.message);
			setError(error.message);
		}
	};
	useEffect(() => {
		fetchEmployeesForTaskAssignment();
	}, [userRecord]); // Re-fetch employees when userRecord changes
	console.log(`User Record:`, userRecord);

	// --- FETCHING TASKS
	const fetchTasks = async () => {
		try {
			if (!userRecord) return; // Exit if userRecord is not loaded
			// BUG MAKE SURE ALL THE LEETERS ARE LOWERCASE FOR SELECIT
			let query = supabase.from('task').select('*');
			console.log(`User Record:`, userRecord);
			// Determine tasks visibility based on the user's role
			switch (userRecord.jobroleid) {
				case 1: // Chief
				case 2: // Manager
				case 3: // Secretary
					query = query.eq('organizationid', userRecord.organizationid);
					break;
				case 4: // Team Leader
					// FIXME BUG TODO the column names might be wrong, make sure they're lowercase
					// For team leaders, fetch tasks assigned to them and to their team members
					const teamQuery = supabase.from('TeamMembers').select('TeamID').eq('UserID', userRecord.userid);
					const { data: teamData } = await teamQuery;
					const teamIds = teamData.map((team) => team.TeamID);
					// BUG                                                               add column name
					query = query.in('AssignedToTeamID', teamIds).or('AssignedToUserID').eq(userRecord.userid);
					break;
				case 5: // Worker
					// Workers see only their tasks
					query = query.eq('assignedtoauthid', userRecord.authid);
					break;
				default:
					// Handle other roles or undefined role
					setTasks([]);
					return;
			}
			const { data: tasksData, error } = await query;
			if (error) throw error;
			setTasks(tasksData);
		} catch (error) {
			console.error('Error fetching tasks:', error.message);
			setError(error.message);
		}
	};

	useEffect(() => {
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
				// TODO This should be displayed on the screen
				console.log('User logged out');
			}
		});
		return () => {
			if (data && data.subscription) {
				data.subscription.unsubscribe();
			}
		};
	}, []);

	useEffect(() => {
		fetchTasks();
	}, [userRecord]);

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

	// --- SIGNOUT USER

	const signOutUser = useCallback(async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Error logging out:', error.message);
			setError(error.message);
		} else {
			console.log('User is logged off');
			setUser(null);
			setUserRecord(null);
		}
	}, []);

	// BUG user can be removed?
	return <UserDataContext.Provider value={{ user, userRecord, error, signOutUser, tasks, fetchTasks, employeesForTask, fetchUserByAuthId }}>{children}</UserDataContext.Provider>;
};

// Create a list of queries i want to perform for the task table
//  --- Getting data
// 1. The orgatnization owner can see the tasks where the organization Id is the same as his
// It includes the authetication table to check the logged in user -> users table (with all details like organizationId, jobroleId etc) and the jobroleid is equal to 1(chief),2(manager),3(secretary) only these 3 roles
// 2. Another query will be for team leaders as he can see the records where he's assigned and his workers.
// 3. The worker can only see his records
//

// --- Editing data
// 1. people who can modify the data are job roles 1,2,3 only

// --- Removing data
// 1. Manager(2) and Secretary(3) can move the records to archives but they're not able to fully delete it, they can only move the record to archives and retrieve it so it's again visible
// 2. Only chief can delete them permanently from the database

//  --- Adding data
// people with a job role id 1,2,3 can only add tasks

// 2. Everone can mark the task as completed but when worker with jobrole 5 will mark it as completed it will need to be approved by a jobrole 4 or 2, secretary should ne be responsbile for that

// When assigning someone to the task i want to have a scrolling list of who to pick, wheter a team or a single user, it will need to be visible
// so it will need to fetch the records of employees who are in the same organization and who's jobroles are 4 and 5
// and for teams it will just need to show teams, but how
