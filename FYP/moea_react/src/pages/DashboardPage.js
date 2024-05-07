// React
import React, { useState } from 'react';
// Data

// Styles
import SideNavigationBar from '../components/application/sideBarComponents/SideNaviagtionBar.js';
import DashboardOptions from '../components/application/dashboardPageComponents/DashboardOptions.js';
import HelpIcon from '../components/application/HelpIcon.js';
const DashboardPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const helpContent = 'This dashboard provides a visual overview of key metrics and trends. Use the filters above to adjust the displayed data according to specific parameters';

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};
	return (
		<>
			<SideNavigationBar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>
			<HelpIcon helpContent={helpContent} />
			<DashboardOptions isSidebarOpen={isSidebarOpen} />
		</>
	);
};
export default DashboardPage;
