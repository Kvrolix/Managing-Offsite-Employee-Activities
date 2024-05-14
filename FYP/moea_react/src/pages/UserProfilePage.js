import React, { useContext, useState } from 'react';
import SideNavigationBar from '../components/application/sideBarComponents/SideNaviagtionBar';
import HelpIcon from '../components/application/HelpIcon';
import { getPositionName } from '../context/helpers';
import { UserDataContext } from '../context/UserDataContext';

import UserProfileCSS from '../components/application/userProfilePageComponents/UserProfilePage.module.css';
const UserProfilePage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const { userRecord } = useContext(UserDataContext);
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};
	const getHelpContentBasedOnRole = (jobRole) => {
		const colourDefinition = () => {
			return (
				<>
					<h3 className="help_header">Colours definition</h3>
					<ul className="help_list">
						<li>🟥 Chief</li>
						<li>🟧 Manager</li>
						<li>🟨 Secretary</li>
						<li>🟦 Team Leader</li>
						<li>🟩 Worker</li>
					</ul>{' '}
				</>
			);
		};

		switch (jobRole) {
			case 1: // Chief
				return (
					<div>
						<h3 className="help_header">As a {getPositionName(userRecord.jobroleid)}</h3>
						<p> You have access to view all employees on the map. You can monitor locations and manage the overall workforce distribution to ensure optimal operational efficiency.</p>
						{colourDefinition()}
					</div>
				);

			case 2: // Manager
				return (
					<div>
						<h3 className="help_header">As a {getPositionName(userRecord.jobroleid)}</h3>
						<p> You can view the locations of the employees under your supervision on the map. This allows you to coordinate and manage your team's activities effectively.</p>
						{colourDefinition()}
					</div>
				);

			case 3: // Secretary
				return (
					<div>
						<h3 className="help_header">As a {getPositionName(userRecord.jobroleid)}</h3>
						<p>You have the ability to view specific employee locations on the map as required for scheduling and organizational tasks.</p>
						<h3 className="help_header">Colours definition</h3>
						{colourDefinition()}
					</div>
				);

			case 4: // Team Leader
				return 'Access Denied: Team Leaders do not have access to view the map component. Please contact your Manager for necessary information.';
			case 5: // Worker
				return 'Access Denied: Workers do not have access to view the map component. Please refer to your direct supervisor for any location-based inquiries.';
			default: // Undefined
				return 'Access Denied: Your role does not have access to the map component. Please contact your administrator if you believe this is an error.';
		}
	};
	return (
		<>
			<SideNavigationBar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>
			<HelpIcon helpContent={getHelpContentBasedOnRole(userRecord.jobroleid)} />
			<div className={UserProfileCSS.page_container}>
				<h1 className={UserProfileCSS.page_heading}>USER PROFILE</h1>
			</div>
		</>
	);
};

export default UserProfilePage;
