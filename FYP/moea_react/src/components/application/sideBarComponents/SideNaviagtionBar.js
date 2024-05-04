// React
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Styles and images
import SideNavigationBarCSS from './SideNavigationBar.module.css';
import logo from '../../../images/MOEA_logo.png';

// Data
import { UserDataContext } from '../../../context/UserDataContext.js';

// Navigation
import { useAppNavigate } from '../../../context/useAppNavigate.js';

const SideBarLink = ({ iconClass, text, navigateTo }) => (
	// TODO Add onchange to the li element
	<li className={`${SideNavigationBarCSS.nav_link}}`}>
		<div
			className={SideNavigationBarCSS.btnLink}
			role="button"
			tabIndex="0"
			onClick={navigateTo}>
			{' '}
			{/*TODO Ajust the path */}
			<i className={`${iconClass} ${SideNavigationBarCSS.icon}`}></i>
			<span className={`${SideNavigationBarCSS.text} ${SideNavigationBarCSS.nav_text}`}>{text}</span>
		</div>
	</li>
);

const SideNavigationBar = ({ isSidebarOpen, toggleSidebar }) => {
	// TODO every <a></a> needs to be replaced with a button class
	// Icons needs to be fixed and replaced
	// TODO css will need to be updated as well
	// TODO Change every link to a component as it takes so much space
	// State to manage if the sidebar is open or closed
	// TODO Update the name of the suer logged in Dynamically
	// TODO fetch the jobroleId to show the actual value, it should be from the supabase not written in the app to reduce the errors
	// BUG To fix the error of moving components i could set the z-index to 100 and it would not have effect on that part of layout

	// Function to toggle the sidebar state

	const navigate = useNavigate(); // TODO I think it can be removed

	const { navigateToDashboard, navigateToTasks, navigateToOrganization, navigateToUsers } = useAppNavigate();
	const [jobroleid, setJobRoleId] = useState(null);
	const { userRecord, signOutUser } = useContext(UserDataContext);

	if (!userRecord) {
		// Render a loading message or null if userRecord is not yet available
		return (
			<>
				<div>Loading user details...</div>
			</>
		);
	}

	// Now it's safe to destructure userRecord as it's guaranteed to be non-null
	const { firstname, surname, jobroleId } = userRecord;

	// TODO This will be transferred to the other places as well
	const handleLogout = async () => {
		await signOutUser();
		navigate('/');
	};

	return (
		<>
			<div className={SideNavigationBarCSS.body}>
				<nav className={`${SideNavigationBarCSS.sidebar} ${isSidebarOpen ? '' : SideNavigationBarCSS.close}`}>
					<header>
						<div className={SideNavigationBarCSS.image_text}>
							<span className={SideNavigationBarCSS.image}>
								<img
									src={logo}
									alt="logo"
								/>
							</span>
							<div className={`${SideNavigationBarCSS.text} ${SideNavigationBarCSS.header_text}`}>
								<span className={SideNavigationBarCSS.fullName}>{`${firstname} ${surname}`}</span>
								<span className={SideNavigationBarCSS.position}>Chief</span> {/* TODO Update dynamically */}
							</div>
							<i
								className={`bx bx-chevron-right ${SideNavigationBarCSS.toggle}`}
								onClick={toggleSidebar}></i>
						</div>
					</header>
					<div className={SideNavigationBarCSS.menu_bar}>
						<div className={SideNavigationBarCSS.menu}>
							<ul className={SideNavigationBarCSS.menu_links}>
								{/* DASHBOARD */}
								<SideBarLink
									iconClass="bx bx-home-smile"
									text="Dashboard"
									navigateTo={navigateToDashboard}
								/>
								{/* TASKS */}
								<SideBarLink
									iconClass="bx bx-list-ul"
									text="Tasks"
									// visible={jobroleid === 1}
									navigateTo={navigateToTasks}
								/>
								{/* TEAMS */}
								<SideBarLink
									iconClass="bx bx-group"
									text="Teams"
									// navigateTo={}
								/>
								{/* CHAT */}
								<SideBarLink
									iconClass="bx bx-message-dots"
									text="Chat"
									// navigateTo={}
								/>
								{/* FILES */}
								<SideBarLink
									iconClass="bx bx-file"
									text="Files"
									// navigateTo={}
								/>
								{/* USERS */}
								<SideBarLink
									iconClass="bx bx-user-check"
									text="Users"
									navigateTo={navigateToUsers}
								/>
								{/* ORGANIZATION */}
								<SideBarLink
									iconClass="bx bx-briefcase"
									text="Organization"
									navigateTo={navigateToOrganization}
								/>
							</ul>
						</div>
						<div className="bottom-content">
							<SideBarLink
								iconClass="bx bx-log-out"
								text="Logout"
								navigateTo={handleLogout}
							/>
						</div>
					</div>
				</nav>
			</div>
		</>
	);
};

export default SideNavigationBar;
