import React, { useState, useContext } from 'react';
import { UserDataContext } from '../context/UserDataContext';
import SideNavigationBar from '../components/application/sideBarComponents/SideNaviagtionBar.js';
import AddUserModal from '../components/application/usersPageComponents/AddUserModal.js';
import ViewUsersModal from '../components/application/usersPageComponents/ViewUserModal.js';
import UsersPageCSS from '../components/application/usersPageComponents/UsersPage.module.css';
import EditUserModal from '../components/application/usersPageComponents/EditUserModal.js';

//TODO
import HelpIcon from '../components/application/HelpIcon.js';

// BUG IT IS NOT possible to query users table
// BUG Skipt if for now and wait for teh authorization of the domain
const UsersPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isAddUsersModalOpen, setIsAddUsersModalOpen] = useState(false);
	const [isViewUsersModalOpen, setIsViewUsersModalOpen] = useState(false);
	const [isEditUsersModalOpen, setIsEditUsersModalOpen] = useState(false);

	const { userRecord, allEmployees } = useContext(UserDataContext);
	const jobRole = userRecord.jobroleid;

	const getHelpContentBasedOnRole = (jobRole) => {
		switch (jobRole) {
			case 1: // Chief
				return "As a Chief, you have full access on this page. You can add new users, view all users within the organization, and edit details of any user.  Use the 'Add New User' button to register new employees, and the 'View Users' option to see a list of all current employees. You can also update any users details through the 'Edit' option.";
			case 2: // Manager
				return "As a Manager, you can add new users, view all users, and edit user details. Use the 'Add New User' button to invite new staff, the 'View Users' option to oversee all employees in your jurisdiction, and modify any pertinent details of employees as needed.";
			case 3: // Secretary
				return "As a Secretary, you have the ability to add new users and view all users. You can use the 'Add New User' button to register newcomers and 'View Users' to look up contact details and responsibilities of all employees.";
			case 4: // Team Leader
				return "As a Team Leader, your access is limited to viewing users within your team. Use the 'View Users' feature to see a list of your team members. You can view but not edit the details of the team members.";
			default:
				return 'Access to this page is restricted based on your user role. If you believe you are seeing this message in error, please contact your system administrator.';
		}
	};

	const helpContent = getHelpContentBasedOnRole(jobRole);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const ContentElement = ({ icon, text, navigateTo }) => (
		<div
			className={UsersPageCSS.content_element}
			onClick={navigateTo}>
			<div className={UsersPageCSS.content_icon}>
				<span class="material-symbols-outlined">{icon}</span>
			</div>
			<p>{text}</p>
		</div>
	);

	return (
		<>
			<SideNavigationBar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>
			<HelpIcon helpContent={helpContent} />
			<div className={UsersPageCSS.container_page}>
				<h1 className={UsersPageCSS.page_heading}>USERS PAGE</h1>
				<div className={UsersPageCSS.content}>
					<div className={UsersPageCSS.content_grid}>
						<ContentElement
							icon="person_add"
							text="Add Users"
							navigateTo={() => setIsAddUsersModalOpen(true)}
						/>
						<ContentElement
							icon="conditions"
							text="View Users"
							navigateTo={() => setIsViewUsersModalOpen(true)}
						/>
						<ContentElement
							icon="edit_note"
							text="Edit Users"
							navigateTo={() => setIsEditUsersModalOpen(true)}
						/>
						<ContentElement
							icon="person_remove"
							text="Delete Users"
							// TODO
							// navigateTo={() => setIsViewUsersModalOpen(true)}
						/>
					</div>
				</div>
			</div>
			<EditUserModal
				isOpen={isEditUsersModalOpen}
				onClose={() => setIsEditUsersModalOpen(false)}
				users={allEmployees}
			/>
			<ViewUsersModal
				isOpen={isViewUsersModalOpen}
				onClose={() => setIsViewUsersModalOpen(false)}
			/>
			<AddUserModal
				isOpen={isAddUsersModalOpen}
				onClose={() => setIsAddUsersModalOpen(false)}
			/>
		</>
	);
};

export default UsersPage;
