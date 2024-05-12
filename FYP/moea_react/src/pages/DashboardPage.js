// React
import React, { useContext, useState } from 'react';

// Components
import SideNavigationBar from '../components/application/sideBarComponents/SideNaviagtionBar.js';
import HelpIcon from '../components/application/HelpIcon.js';
import DashboardOptions from '../components/application/dashboardPageComponents/DashboardOptions.js';

// Data
import { UserDataContext } from '../context/UserDataContext.js';
import { getPositionName } from '../context/helpers.js';
const DashboardPage = () => {
	const { userRecord } = useContext(UserDataContext);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const getHelpContentBasedOnRole = (jobRole) => {
		const higherPosition = () => {
			return (
				<>
					<div>
						<h3 className="help_header">As a {getPositionName(userRecord.jobroleid)}</h3>
						<p>You have unrestricted access to the entire Dashboard.</p>

						<h3 className="help_header__secondary">This includes:</h3>
						<ol className="help_list_numbered">
							<li>Managing tasks</li>
							<li>Overseeing teams</li>
							<li>Accessing files</li>
							<li>Managing user permissions</li>
							<li>Viewing organizational details</li>
							<li>Utilizing the map for strategic planning</li>
						</ol>
						<p>This comprehensive access supports your role in top-level decision-making and organizational oversight.</p>
					</div>
				</>
			);
		};

		switch (jobRole) {
			case 1: // Chief
				return higherPosition();
			case 2: // Manager
				return higherPosition();
			case 3: // Secretary
				return higherPosition();

			case 4: // Team Leader
				return (
					<div>
						<h3 className="help_header">As a {getPositionName(userRecord.jobroleid)}</h3>
						<p className="help_paragraph">Your access to the Dashboard is tailored to your operational needs</p>
						<h3 className="help_header__secondary">This includes:</h3>
						<ol className="help_list_numbered help_text">
							<li>Managing tasks</li>
							<li>Overseeing teams</li>
							<li>Accessing files</li>
							<li>Viewing organizational details</li>
							<li>Utilizing the map for strategic planning</li>
						</ol>
						<p className="help_paragraph">focusing your responsibilities on direct team leadership and task execution.</p>
					</div>
				);
			case 5: // Worker
				return (
					<div>
						<h3 className="help_header">As a {getPositionName(userRecord.jobroleid)}</h3>
						<p className="help_paragraph">Your access to the Dashboard is tailored to your operational needs</p>
						<h3 className="help_header__secondary">This includes:</h3>
						<ol className="help_list_numbered help_text">
							<li>Managing tasks</li>
							<li>Accessing files</li>
							<li>Viewing organizational details</li>
						</ol>
						<p className="help_paragraph">Access to teams, user management, and organizational details is restricted to ensure data privacy and to streamline your focus on task execution.</p>
					</div>
				);

			default: // Undefined
				return 'Access Denied: Your current role does not include access to the Dashboard. If you believe this is an oversight or if your role requires adjustment, please contact the system administrator.';
		}
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};
	const getJobRole = userRecord.jobroleid;
	return (
		<>
			<SideNavigationBar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>
			<HelpIcon helpContent={getHelpContentBasedOnRole(getJobRole)} />
			<DashboardOptions isSidebarOpen={isSidebarOpen} />
		</>
	);
};
export default DashboardPage;
