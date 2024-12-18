import React, { createContext, useState, useEffect, useCallback } from 'react';
import supabase from '../config/supabaseClient';

export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);
	const [employeesForTask, setEmployeesForTask] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [userRecord, setUserRecord] = useState(null); // BUG

	// THIS FUNCTION SETS THE SESSION
	const fetchUserRecord = async (userId) => {
		try {
			let { data: userRecord, error } = await supabase.from('users2').select('*').eq('authid', userId).single();

			if (error) throw error;
			setUserRecord(userRecord);
		} catch (error) {
			console.error('Error fetching user record:', error.message);
			setError(error.message);
		}
	};

	const fetchUserByAuthId = async (authid) => {
		try {
			let { data: user, error } = await supabase.from('users2').select('*').eq('authid', authid).single();

			if (error) throw error;
			return user;
		} catch (error) {
			console.error('Error fetching user by authid:', error.message);
			return null;
		}
	};

	const fetchEmployeesForTaskAssignment = async () => {
		try {
			if (!userRecord) return;
			const { data: employees, error } = await supabase.from('users2').select('*').eq('organizationid', userRecord.organizationid).in('jobroleid', [4, 5]);
			if (error) throw error;

			setEmployeesForTask(employees);
		} catch (error) {
			console.error('Error fetching employees for task assignment:', error.message);
			setError(error.message);
		}
	};
	useEffect(() => {
		fetchEmployeesForTaskAssignment();
	}, [userRecord]);

	// -------------------------------------- FETCHING TASKS ------------------------------------------
	const fetchTasks = async () => {
		try {
			if (!userRecord) return;

			let query = supabase.from('task').select('*');
			switch (userRecord.jobroleid) {
				case 1: // Chief
				case 2: // Manager
				case 3: // Secretary
					query = query.eq('organizationid', userRecord.organizationid);
					break;
				case 4: // Team Leader
					// For team leaders, fetch tasks assigned to them and to their team members
					const teamQuery = supabase.from('teammembers').select('teamid').eq('userauthid', userRecord.userid);
					const { data: teamData } = await teamQuery;
					const teamIds = teamData.map((team) => team.teamid);
					// BUG                                                               add column name
					query = query.in('assignedtoteamid', teamIds).or('assignedtoauthid').eq(userRecord.userid);
					break;
				case 5: // Worker
					// Workers see only their tasks
					query = query.eq('assignedtoauthid', userRecord.authid);
					break;
				default:
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

	// ----------------------------------- USERS -----------------

	const register = async (email, password) => {
		try {
			const { user, error, session } = await supabase.auth.signUp({
				email: email,
				password: password,
			});

			console.log('SignUp response:', { user, error, session });

			if (error) {
				console.error('Error signing up:', error);
				return { error };
			}
			if (!user) {
				console.log('User object is undefined, possibly pending confirmation.');
				return { user: null, session };
			}
			return { user, session };
		} catch (err) {
			console.error('An exception occurred during signUp:', err);
			return { error: err };
		}
	};

	// BUG TODO FIXME
	// const registerAndCreateProfile = async (email, password, firstName, surname, phonenumber, dateofbirth) => {
	// 	// Sign up the user
	// 	const { user, error } = await supabase.auth.signUp(
	// 		{
	// 			email: email,
	// 			password: password,
	// 		}
	// 		// {
	// 		// 	data: {
	// 		// 		first_name: firstName,
	// 		// 	},
	// 		// }
	// 	);
	// 	console.log(user);

	// 	if (error) {
	// 		console.error('Error signing up:', error);
	// 		return { error };
	// 	}

	// 	// Create user profile in custom 'users2' table
	// 	console.log(user);
	// 	if (user) {
	// 		const { data, error: insertError } = await supabase.from('users2').insert([
	// 			{
	// 				authid: user.id,
	// 				emailaddress: email,
	// 				firstname: firstName,
	// 				surname: surname,
	// 				phonenumber: phonenumber,
	// 				dateofbirth: dateofbirth,
	// 			},
	// 		]);

	// 		if (insertError) {
	// 			console.error('Error creating user profile:', insertError);
	// 			return { error: insertError };
	// 		}
	// 		console.log(user);
	// 		return { user: data[0] }; // Return the newly created user profile
	// 	}

	// 	return { error: new Error('Unexpected error during the registration process.') };
	// };

	// ------------------------------- ORGANIZATION PAGE -----------------------------------------

	const [allEmployees, setAllEmployees] = useState([]);

	const fetchAllEmployees = async () => {
		try {
			if (!userRecord) return;
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
			const { data, error } = await supabase.from('jobrole').select('rolename').eq('jobroleid', jobroleid).single();

			if (error) {
				throw error;
			}

			return data.name;
		} catch (error) {
			console.error(`Error fetching job role name for id ${jobroleid}:`, error.message);
			return 'Unknown';
		}
	};

	const updateEmployeeDetails = async (authid, formData) => {
		try {
			const { data, error } = await supabase
				.from('users2')
				.update({
					firstname: formData.firstname,
					surname: formData.lastname,
					phonenumber: formData.phone,
					emailaddress: formData.email,
					jobroleid: formData.jobrole,
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

	const [organizationName, setOrganizationName] = useState('');
	const fetchOrganizationName = async (organizationId) => {
		try {
			const { data, error } = await supabase.from('organizations').select('organizationname').eq('organizationid', organizationId).single();

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
			return null;
		}
	};
	// ---------------------------------------------------------------------------------------------------------
	// ------------------------------------------ TEAMS PAGE ---------------------------------------------------

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
			return null;
		}
	};

	// TODO
	// CHECK IF IT NOT FETCHING FROM OTHER ORGNIZATIONS
	const [teamLeaders, setTeamLeaders] = useState([]);
	const fetchTeamLeaders = async () => {
		try {
			let { data: teamLeaders, error } = await supabase.from('users2').select('*').eq('jobroleid', 4).eq('organizationid', userRecord.organizationid);

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

	const fetchTeams = async () => {
		try {
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

	const fetchTeamById = async (teamid) => {
		try {
			const { data, error } = await supabase.from('team').select('*').eq('teamid', teamid);
			if (error) {
				console.error('Error fetching team:', error.message);
				throw error;
			}
			return data || [];
		} catch (error) {
			console.log(`Error during seperate team fetch`, error.message);
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
			const { data, error } = await supabase.from('team').select('teamleaderauthid').eq('teamleaderauthid', leaderId).single();

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

	const addTeamMember = async (members) => {
		try {
			console.log('Attempting to add team members:', JSON.stringify(members));
			console.log(`Team member:`, members);
			const { data, error } = await supabase.from('teammembers').insert(members);

			if (error) {
				console.error('Error with uploading new records:', error.message);
				console.error('Detailed error:', error);
				throw error;
			}

			console.log('Added team members successfully:', data);
			return true;
		} catch (error) {
			console.error('Error during adding records:', error.message);
			return false;
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
	const fetchAvailableWorkers = async () => {
		try {
			let { data: assignedMembers, error: assignedError } = await supabase.from('teammembers').select('userauthid');

			if (assignedError) {
				throw assignedError;
			}

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
			// console.log(availableWorkers);
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

			return true;
		} catch (error) {
			console.error('Error removing team member:', error.message);
			return false;
		}
	};

	// ---------------------------------------------------------------------------------------------------------
	// ------------------------------------------ MAP PAGE -----------------------------------------------------

	const fetchUserLocations = async (userIDs) => {
		try {
			if (!userIDs.length) return []; // Return an empty array if no user IDs are provided

			// Fetch locations where UserID is in the list of userIDs
			const { data, error } = await supabase
				.from('userlocation')
				.select(
					`
					userlocationid,
					latitude,
					longitude,
					recordeddatetime,
					userauthid 
				`
				)
				.in('userauthid', userIDs);

			if (error) {
				console.error('Error fetching user locations:', error);
				return [];
			}

			return data;
		} catch (err) {
			console.error('Error fetching user locations:', err);
			return [];
		}
	};

	// fetch only records from the list of employees

	// -----------------------------------------------------------------------------------

	// --------------------------------FILES PAGE-----------------------------------------

	const uploadFile = async (file) => {
		const fileName = `${file.name}`;
		const path = `${fileName}`;

		const { error } = await supabase.storage.from(`org-${userRecord.organizationid}`).upload(path, file);

		return { path, error };
	};

	const downloadFile = async (path) => {
		const { data, error } = await supabase.storage.from(`org-${userRecord.organizationid}`).download(path);

		return { data, error };
	};

	const deleteFile = async (onConfirmDelete) => {
		const { error } = await supabase.storage.from(`org-${userRecord.organizationid}`).remove([onConfirmDelete]);
		return { error };
	};

	const listFiles = async () => {
		const { data, error } = await supabase.storage.from(`org-${userRecord.organizationid}`).list();

		return { data, error };
	};
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

	return (
		<UserDataContext.Provider
			// IMPROVE THE FUNCTION NAMES
			value={{
				// GENERAL
				user,
				userRecord,
				error,
				signOutUser,
				// TASKS
				tasks,
				fetchTasks,
				employeesForTask,
				// NOT SORTED
				fetchUserByAuthId,
				fetchJobRoleNameById,
				fetchOrganizationName,
				fetchWorkers,
				fetchAvailableWorkers,
				allEmployees,
				updateEmployeeDetails,
				workers,
				register,
				// TEAMS PAGE
				fetchTeamById,
				fetchTeamLeaders,
				teamLeaders,
				checkTeamLeaderAssigned,
				fetchTeams,
				addTeamMember,
				fetchTeamMembers,
				createTeam,
				updateTeamName,
				removeTeamMember,
				fetchAssignedTeamMembers,
				fetchTeamsByLeaderId,
				// MAP GAE
				fetchUserLocations,
				// FILES PAGE
				uploadFile,
				deleteFile,
				downloadFile,
				listFiles,
			}}>
			{children}
		</UserDataContext.Provider>
	);
};
