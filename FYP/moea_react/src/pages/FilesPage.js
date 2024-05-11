import React, { useState } from 'react';
import SideNavigationBar from '../components/application/sideBarComponents/SideNaviagtionBar';

import FilesPageCSS from '../components/application/filesPageComponents/FilesPage.module.css';

import FileListModal from '../components/application/filesPageComponents/FileListModal';

const FilesPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	// const helpContent = 'This dashboard provides a visual overview of key metrics and trends. Use the filters above to adjust the displayed data according to specific parameters';

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<>
			<SideNavigationBar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>
			<div className={FilesPageCSS.page_container}>
				<h1 className={FilesPageCSS.page_heading}>Documents</h1>
				<div className={FilesPageCSS.page_content}>
					<FileListModal />
				</div>
			</div>
		</>
	);
};

export default FilesPage;
