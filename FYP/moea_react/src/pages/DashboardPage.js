// React
import React, { useState } from 'react';
// Data

// Styles
import SideNavigationBar from '../components/application/sideBarComponents/SideNaviagtionBar.js';
import DashboardOptions from '../components/application/dashboardPageComponents/DashboardOptions.js';

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
		</>
	);
};

export default DashboardPage;
