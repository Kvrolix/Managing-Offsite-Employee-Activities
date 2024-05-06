import React, { useState, useContext } from 'react';
import { UserDataContext } from '../context/UserDataContext';
import SideNavigationBar from '../components/application/sideBarComponents/SideNaviagtionBar.js';
import AddUserModal from '../components/application/usersPageComponents/AddUserModal.js';
import ViewUsersModal from '../components/application/usersPageComponents/ViewUserModal.js';
import UsersPageCSS from '../components/application/usersPageComponents/UsersPage.module.css';
import EditUserModal from '../components/application/usersPageComponents/EditUserModal.js';

import supabase from '../config/supabaseClient.js';

// BUG IT IS NOT possible to query users table
// BUG Skipt if for now and wait for teh authorization of the domain
const UsersPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
	const [isViewUsersModalOpen, setIsViewUsersModalOpen] = useState(false);
	const [isEditUsersModalOpen, setIsEditUsersModalOpen] = useState(false);

	const [currentUser, setCurrentUser] = useState(null);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const handleEdit = (user) => {
		setCurrentUser(user);
		setIsEditUsersModalOpen(true);
	};

	// async function signUpUser(email, password) {
	// 	try {
	// 		const { user, error } = await supabase.auth.signUp({
	// 			email: email,
	// 			password: password,
	// 		});

	// 		if (error) {
	// 			console.error('Error during sign up:', error.message);
	// 			return; // Exit the function if there's an error
	// 		}

	// 		if (user) {
	// 			console.log('User created:', user);
	// 		}
	// 	} catch (error) {
	// 		console.error('Unexpected error during sign up:', error.message);
	// 	}
	// }
	// function waitThenCreate() {
	// 	setTimeout(2000);
	// 	signUpUser('test@esssa.com', '123456');
	// }
	// waitThenCreate();

	// THINK ABOUT IT

	const getData = async () => {
		try {
			const {
				data: { identities },
			} = await supabase.auth.getUserIdentities();
			// const { data, error } = await supabase.from('auth.users').select('email');
			// const { data, error } = await supabase.auth.getUser();
			// const { data, error } = await supabase.auth.api.getUserByEmail('email');
			// const { data, error: fetchError } = await supabase.auth.api.listUsers();
			// const { data, error: fetchError } = await supabase.from('auth.Users').select('email').single();
			console.log(`The data from users:`, identities);
		} catch (err) {
			console.log(err);
		}
	};

	getData();

	// Deletre user from the system, it will be problematic

	// Buttons
	// View user
	// edit user

	const { allEmployees } = useContext(UserDataContext);
	console.log(allEmployees);

	// BUGS WITH THE NAMES FIX IT
	return (
		<>
			<SideNavigationBar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>
			<div className={UsersPageCSS.container_page}>
				<h1 className={UsersPageCSS.page_heading}>USERS PAGE</h1>
				<button onClick={() => setIsAddUserModalOpen(true)}>Add New User</button>
				<AddUserModal
					isOpen={isAddUserModalOpen}
					onClose={() => setIsAddUserModalOpen(false)}
				/>
				<button onClick={() => setIsViewUsersModalOpen(true)}>View Users</button>
				<ViewUsersModal
					isOpen={isViewUsersModalOpen}
					onClose={() => setIsViewUsersModalOpen(false)}
				/>
				{isEditUsersModalOpen && (
					<EditUserModal
						isOpen={isEditUsersModalOpen}
						onClose={() => setIsEditUsersModalOpen(false)}
						user={currentUser}
					/>
				)}
			</div>
		</>
	);
};

export default UsersPage;
