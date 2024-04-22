// React
import React, { useState } from 'react';
// Data

// Styles
import SideNavigationBar from '../components/application/SideNaviagtionBar.js';
import DashboardOptions from '../components/application/DashboardOptions.js';

const DashboardPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};
	console.log('Organization page');

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
