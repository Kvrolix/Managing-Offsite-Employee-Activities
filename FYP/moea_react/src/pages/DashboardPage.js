// React
import React, { useState } from 'react';
// Data
import TestingUserContext from './TestingUserContext.js';

// Styles
import SideNavigationBar from '../components/application/SideNaviagtionBar.js';
import DashboardOptions from '../components/application/DashboardOptions.js';

const DashboardPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<>
			<SideNavigationBar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>
			<DashboardOptions isSidebarOpen={isSidebarOpen} />
			<TestingUserContext />
		</>
	);
};

export default DashboardPage;
