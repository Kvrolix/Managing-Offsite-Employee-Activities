import React, { createContext, useState, useEffect, useCallback } from 'react';
import supabase from '../config/supabaseClient';

export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);
	const [employeesForTask, setEmployeesForTask] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [userRecord, setUserRecord] = useState(null); // BUG

	// BUG THIS CAN BE REMOVED? OR COMBINED WITH A FUNCTION BELOW
	const fetchUserRecord = async (userId) => {
		try {
			let { data: userRecord, error } = await supabase.from('users2').select('*').eq('authid', userId).single();
			// console.log(userRecord);
			if (error) throw error;
			setUserRecord(userRecord);
			// console.log(`Fetched user record:`, userRecord);
		} catch (error) {
			console.error('Error fetching user record:', error.message);
			setError(error.message);
		}
	};

	const fetchUserByAuthId = async (authid) => {
		try {
			let { data: user, error } = await supabase.from('users2').select('*').eq('authid', authid).single();

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
			// console.log('Employees for task assignment:', employees);
			setEmployeesForTask(employees);
		} catch (error) {
			console.error('Error fetching employees for task assignment:', error.message);
			setError(error.message);
		}
	};
	useEffect(() => {
		fetchEmployeesForTaskAssignment();
	}, [userRecord]); // Re-fetch employees when userRecord changes
	// console.log(`User Record:`, userRecord);

	// --- FETCHING TASKS
	const fetchTasks = async () => {
		try {
			if (!userRecord) return; // Exit if userRecord is not loaded
			// BUG MAKE SURE ALL THE LEETERS ARE LOWERCASE FOR SELECIT
			let query = supabase.from('task').select('*');
			// console.log(`User Record:`, userRecord);
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

	// --- ORGANIZATION PAGE

	const [allEmployees, setAllEmployees] = useState([]);

	const fetchAllEmployees = async () => {
		try {
			if (!userRecord) return; // Ensure there is a user record
			const { data, error } = await supabase.from('users2').select('*').eq('organizationid', userRecord.organizationid);
			if (error) throw error;
			setAllEmployees(data);
		} catch (error) {
			console.error('Error fetching all employees:', error.message);
		}
	};

	useEffect(() => {
		fetchAllEmployees();
	}, [userRecord]); // Fetch when userRecord changes

	const fetchJobRoleNameById = async (jobroleid) => {
		try {
			const { data, error } = await supabase
				.from('jobrole') // Replace 'jobroles' with your actual table name
				.select('rolename') // Assuming 'name' is the column storing job role names
				.eq('jobroleid', jobroleid)
				.single(); // Using single because jobroleid is expected to uniquely identify a role

			if (error) {
				throw error;
			}

			return data.name; // Returning the name of the job role
		} catch (error) {
			console.error(`Error fetching job role name for id ${jobroleid}:`, error.message);
			return 'Unknown'; // Return a default or error-specific name
		}
	};

	// UPDATE USER RECORD
	const updateEmployeeDetails = async (authid, formData) => {
		try {
			const { data, error } = await supabase
				.from('users2')
				.update({
					firstname: formData.firstname,
					surname: formData.lastname,
					phonenumber: formData.phone,
					emailaddress: formData.email,
					jobroleid: formData.jobrole, // Make sure your table has an 'email' column if you're including this
				})
				.eq('authid', authid);

			if (error) throw error;
			console.log('Updated user details:', data);
			return data;
		} catch (error) {
			console.error('Error updating employee details:', error.message);
			return null;
		}
	};

	// Get Company name
	const [organizationName, setOrganizationName] = useState('');
	const fetchOrganizationName = async (organizationId) => {
		try {
			const { data, error } = await supabase.from('organizations').select('organizationname').eq('organizationid', organizationId).single(); // Assuming each organization ID uniquely identifies one organization

			if (error) {
				throw error;
			}

			if (data) {
				setOrganizationName(data.organizationname);
				return data.organizationname;
			}
		} catch (error) {
			console.error('Error fetching organization name:', error.message);
			setError(error.message);
			return null; // You can handle the error as needed
		}
	};

	// CHAT FUNCTIONALITY
	// Function to create a new chat session
	const createChatSession = async () => {
		const { data, error } = await supabase.from('ChatSessions').insert([{ createdDate: new Date() }]);
		if (error) {
			console.error('Error creating chat session:', error.message);
			setError(error.message);
			return null;
		}
		return data[0].id; // return the new session ID
	};

	// Function to add participants to a chat session
	const addChatParticipants = async (sessionId, participantIds) => {
		const participantRecords = participantIds.map((userId) => ({
			ChatSessionID: sessionId,
			UserID: userId,
		}));

		const { error } = await supabase.from('ChatParticipants').insert(participantRecords);
		if (error) {
			console.error('Error adding chat participants:', error.message);
			setError(error.message);
		}
	};

	// Function to send a message in a chat session
	const sendMessage = async (sessionId, userId, messageText) => {
		const { error } = await supabase.from('Message').insert([
			{
				ChatSessionID: sessionId,
				SentByUserID: userId,
				MessageText: messageText,
				SendDateTime: new Date(),
			},
		]);

		if (error) {
			console.error('Error sending message:', error.message);
			setError(error.message);
		}
	};

	// Function to fetch messages for a chat session
	const fetchMessages = async (sessionId) => {
		const { data, error } = await supabase.from('Message').select('*').eq('ChatSessionID', sessionId);
		if (error) {
			console.error('Error fetching messages:', error.message);
			setError(error.message);
			return [];
		}
		return data;
	};

	// --------------------------------TEAMS PAGE-----------------------------------------

	const createTeam = async (teamName, teamLeaderId) => {
		try {
			const { data, error } = await supabase.from('team').insert([{ teamname: teamName, teamleaderauthid: teamLeaderId, OrganizationID: userRecord.organizationid }]);

			if (error) {
				console.error('Error adding team:', error.message);
				throw new Error('Failed to create team');
			}

			return data[0];
		} catch (error) {
			console.error('Error during team creation:', error.message);
			return null; // Explicitly return null to indicate failure
		}
	};

	const [teamLeaders, setTeamLeaders] = useState([]);
	const fetchTeamLeaders = async () => {
		try {
			let { data: teamLeaders, error } = await supabase.from('users2').select('*').eq('jobroleid', 4);

			if (error) throw error;

			setTeamLeaders(teamLeaders);
		} catch (error) {
			console.error('Error fetching team leaders:', error.message);
		}
	};

	const [workers, setWorkers] = useState([]);
	const fetchWorkers = async () => {
		try {
			let { data: workers, error } = await supabase.from('users2').select('*').eq('jobroleid', 5);
			if (error) throw error;
			setWorkers(workers);
		} catch (error) {
			console.error('Error fetching workers:', error.message);
		}
	};

	// const [teams, setTeams] = useState([]);
	// const fetchTeams = async () => {
	// 	try {
	// 		let { data: teams, error } = await supabase.from('team').select('*');
	// 		if (error) throw error;
	// 		setTeams(teams);
	// 	} catch (error) {
	// 		console.error('Error fetching teams', error.message);
	// 	}
	// };
	const fetchTeams = async () => {
		try {
			// It will fetch the record for a correct organization
			const { data, error } = await supabase.from('team').select('*').eq('OrganizationID', userRecord.organizationid);
			if (error) {
				console.error('Error fetching teams:', error.message);
				throw error;
			}
			return data || [];
		} catch (error) {
			console.error('Error during team fetch:', error.message);
			return [];
		}
	};

	const fetchTeamsByLeaderId = async (leaderId) => {
		try {
			const { data, error } = await supabase.from('team').select('*').eq('teamleaderauthid', leaderId);

			if (error) {
				console.error('Failed to fetch teams:', error.message);
				return { success: false, error: error.message };
			}

			return { success: true, teams: data };
		} catch (error) {
			console.error('Error fetching teams:', error.message);
			return { success: false, error: error.message };
		}
	};

	const checkTeamLeaderAssigned = async (leaderId) => {
		try {
			const { data, error } = await supabase.from('team').select('teamleaderauthid').eq('teamleaderauthid', leaderId).single(); // Assumes 'teamleaderauthid' should be unique in the table

			if (error) {
				console.error('Error checking team leader assignment:', error.message);
				throw error;
			}

			return data ? true : false;
		} catch (error) {
			console.error('Error during check:', error.message);
			return null;
		}
	};

	const fetchAssignedTeamMembers = async () => {
		try {
			const { data, error } = await supabase.from('teammembers').select('userauthid');
			if (error) {
				throw error;
			}
			return data.map((item) => item.userauthid); // Return an array of user IDs
		} catch (error) {
			console.error('Error fetching assigned team members:', error.message);
			return [];
		}
	};

	// const addTeamMember = async (members) => {
	// 	try {
	// 		const { data, error } = await supabase.from('teammembers').insert(members);

	// 		if (error) {
	// 			console.error('Error with uploading new records:', error.message);
	// 			throw error;
	// 		}

	// 		console.log('Added team members successfully:', data);
	// 		return true;
	// 	} catch (error) {
	// 		console.error('Error during adding records:', error.message);
	// 		return false;
	// 	}
	// };
	const addTeamMember = async (members) => {
		try {
			console.log('Attempting to add team members:', JSON.stringify(members)); // Ensure data structure is correct
			console.log(`Team member:`, members);
			const { data, error } = await supabase.from('teammembers').insert(members);

			if (error) {
				console.error('Error with uploading new records:', error.message);
				console.error('Detailed error:', error); // Log detailed error
				throw error;
			}

			console.log('Added team members successfully:', data);
			return true; // Return true on success
		} catch (error) {
			console.error('Error during adding records:', error.message);
			return false; // Return false to indicate failure
		}
	};

	const fetchTeamMembers = async (teamid) => {
		try {
			const { data, error } = await supabase.from('teammembers').select('*').eq('teamid', teamid);
			if (error) {
				console.error('Error fetching team members:', error.message);
				throw error;
			}
			return data;
		} catch (error) {
			console.error('Error during fetching team members:', error.message);
			return [];
		}
	};

	const updateTeamName = async (teamId, newName) => {
		try {
			const { data, error } = await supabase.from('team').update({ teamname: newName }).eq('teamid', teamId);

			if (error) throw error;

			console.log('Update successful:', data);
			return true;
		} catch (error) {
			console.error('Failed to update team name:', error.message);
			return false;
		}
	};

	// const fetchAvailableWorkers = async () => {
	// 	try {
	// 		let { data: assignedMembers, error: assignedError } = await supabase.from('teammembers').select('userauthid');

	// 		if (assignedError) {
	// 			throw assignedError;
	// 		}

	// 		const assignedIds = assignedMembers.map((member) => member.userauthid);

	// 		let { data: availableWorkers, error: availableError } = await supabase
	// 			.from('users2')
	// 			.eq('organizationid', userRecord.organizationid)
	// 			.eq('jobroleid', 5)
	// 			.select('*')
	// 			.not('authid', 'in', `(${assignedIds.join(',')})`);

	// 		if (availableError) {
	// 			throw availableError;
	// 		}

	// 		return availableWorkers;
	// 	} catch (error) {
	// 		console.error('Error fetching available workers:', error.message);
	// 		return [];
	// 	}
	// };
	const fetchAvailableWorkers = async () => {
		try {
			let { data: assignedMembers, error: assignedError } = await supabase.from('teammembers').select('userauthid');

			if (assignedError) {
				throw assignedError;
			}

			// Extract userauthid directly for SQL query
			const assignedIds = assignedMembers.map((member) => member.userauthid);
			const idsFormattedForSQL = assignedIds.length ? assignedIds.join(',') : 'NULL';

			let { data: availableWorkers, error: availableError } = await supabase
				.from('users2')
				.select('*')
				.eq('organizationid', userRecord.organizationid)
				.eq('jobroleid', 5)
				.not('authid', 'in', `(${idsFormattedForSQL})`);

			if (availableError) {
				throw availableError;
			}
			console.log(availableWorkers);
			return availableWorkers;
		} catch (error) {
			console.error('Error fetching available workers:', error.message);
			return [];
		}
	};

	const removeTeamMember = async (teamId, userAuthId) => {
		try {
			let { error } = await supabase.from('teammembers').delete().match({ teamid: teamId, userauthid: userAuthId });

			if (error) throw error;

			return true; // Indicate success
		} catch (error) {
			console.error('Error removing team member:', error.message);
			return false; // Indicate failure
		}
	};

	//

	// BUG
	// const addTeamMembers = async (members) => {
	// 	try {
	// 		const { data, error } = await supabase.from('teammembers').insert(members);

	// 		if (error) {
	// 			throw new Error(error.message);
	// 		}
	// 		console.log('Members added:', data);
	// 		return true;
	// 	} catch (error) {
	// 		console.error('Error adding team members:', error);
	// 		return false;
	// 	}
	// };

	// -----------------------------------------------------------------------------------

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

	// CLEAN IT UP
	return (
		<UserDataContext.Provider
			value={{
				user,
				userRecord,
				error,
				signOutUser,
				tasks,
				fetchTasks,
				employeesForTask,
				fetchUserByAuthId,
				allEmployees,
				fetchJobRoleNameById,
				updateEmployeeDetails,
				fetchOrganizationName,
				createChatSession,
				addChatParticipants,
				sendMessage,
				fetchMessages,
				createTeam,
				teamLeaders,
				fetchTeamLeaders,
				workers,
				fetchWorkers,
				fetchTeams,
				// teams,
				fetchTeamsByLeaderId,
				checkTeamLeaderAssigned,
				addTeamMember,
				fetchAssignedTeamMembers,
				fetchTeamMembers,
				updateTeamName,
				fetchAvailableWorkers,
				removeTeamMember,
			}}>
			{children}
		</UserDataContext.Provider>
	);
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
