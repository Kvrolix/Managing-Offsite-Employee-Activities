import React, { useState } from 'react';
import { UserDataContext } from '../context/UserDataContext';
import SideNavigationBar from '../components/application/sideBarComponents/SideNaviagtionBar.js';
import AddUserModal from '../components/application/usersPageComponents/AddUserModal.js';

import UsersPageCSS from '../components/application/usersPageComponents/UsersPage.module.css';
const UsersPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	// const handleSaveUser = (userData) => {
	// 	console.log('User Data:', userData);
	// 	// Here you would typically handle the user data, e.g., sending it to a server
	// 	setIsModalOpen(false); // Close modal after save
	// };
	return (
		<>
			<SideNavigationBar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>
			<div className={UsersPageCSS.container_page}>
				<h1 className={UsersPageCSS.page_heading}>USERS PAGE</h1>
				<button onClick={() => setIsModalOpen(true)}>Add New User</button>
				<AddUserModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
				/>
			</div>
		</>
	);
};

export default UsersPage;
