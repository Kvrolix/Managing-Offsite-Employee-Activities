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
import { getPositionName } from '../../../context/helpers.js';

import { ROLES } from '../../../context/roles.js';
const SideBarLink = ({ iconClass, text, navigateTo }) => (
	// TODO Add onchange to the li element
	<li className={`${SideNavigationBarCSS.nav_link}}`}>
		<div
			className={SideNavigationBarCSS.btnLink}
			role="button"
			tabIndex="0"
			onClick={navigateTo}>
			{/*TODO Ajust the path */}
			<i className={`${iconClass} ${SideNavigationBarCSS.icon}`}></i>
			<span className={`${SideNavigationBarCSS.text} ${SideNavigationBarCSS.nav_text}`}>{text}</span>
		</div>
	</li>
);

const SideNavigationBar = ({ isSidebarOpen, toggleSidebar }) => {
	const navigate = useNavigate(); // TODO I think it can be removed

	const { navigateToDashboard, navigateToTasks, navigateToOrganization, navigateToUsers, navigateToTeams, navigateToFiles } = useAppNavigate();

	const { userRecord, signOutUser } = useContext(UserDataContext);

	if (!userRecord) {
		return (
			<>
				<div>Loading user details...</div>
			</>
		);
	}

	const { firstname, surname } = userRecord;

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
								<span className={SideNavigationBarCSS.position}>{getPositionName(userRecord.jobroleid)}</span>
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
									navigateTo={navigateToTasks}
								/>
								{/* TEAMS */}
								<SideBarLink
									iconClass="bx bx-group"
									text="Teams"
									navigateTo={navigateToTeams}
								/>

								{/* FILES */}
								<SideBarLink
									iconClass="bx bx-file"
									text="Files"
									navigateTo={navigateToFiles}
								/>
								{/* USERS */}
								{[ROLES.CHIEF, ROLES.MANAGER, ROLES.SECRETARY].includes(userRecord.jobroleid) && (
									<SideBarLink
										iconClass="bx bx-user-check"
										text="Users"
										navigateTo={navigateToUsers}
									/>
								)}
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
								navigateTo={signOutUser}
							/>
						</div>
					</div>
				</nav>
			</div>
		</>
	);
};

export default SideNavigationBar;
