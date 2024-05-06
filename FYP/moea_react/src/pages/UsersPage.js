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

	const { allEmployees } = useContext(UserDataContext);

	const [currentUser, setCurrentUser] = useState(null);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const handleEdit = (user) => {
		setCurrentUser(user);
		setIsEditUsersModalOpen(true);
	};

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
				<button onClick={() => setIsEditUsersModalOpen(true)}>Edit Users</button>
				<EditUserModal
					isOpen={isEditUsersModalOpen}
					onClose={() => setIsEditUsersModalOpen(false)}
					users={allEmployees}
				/>
			</div>
		</>
	);
};

export default UsersPage;
