// React
import React, { useContext, useState } from 'react';

// CSS
import FilesPageCSS from '../components/application/filesPageComponents/FilesPage.module.css';

// Components
import FileListModal from '../components/application/filesPageComponents/FileListModal';
import SideNavigationBar from '../components/application/sideBarComponents/SideNaviagtionBar';
import HelpIcon from '../components/application/HelpIcon';

// Data
import { UserDataContext } from '../context/UserDataContext';
import { getPositionName } from '../context/helpers';

const FilesPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const { userRecord } = useContext(UserDataContext);
	// const helpContent = 'This dashboard provides a visual overview of key metrics and trends. Use the filters above to adjust the displayed data according to specific parameters';

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const getJobRoleId = userRecord.jobroleid;

	const getHelpContentBasedOnRole = (jobRole) => {
		switch (jobRole) {
			case 1: // Chief
				return (
					<div>
						<h3 className="help_header">As a {getPositionName(userRecord.jobroleid)}</h3>
						<p className="help_paragraph">You can view, download, add, and remove documents on this page. You have full access to manage all records.</p>
					</div>
				);

			case 2: // Manager
				return (
					<div>
						<h3 className="help_header">As a {getPositionName(userRecord.jobroleid)}</h3>
						<p className="help_paragraph">You can view, download, add, and remove documents on this page. Manage your team's documentation as needed.</p>
					</div>
				);

			case 3: // Secretary
				return (
					<div>
						<h3 className="help_header">As a {getPositionName(userRecord.jobroleid)}</h3>
						<p className="help_paragraph">
							You can view, download, add, and remove documents on this page. Your access allows you to handle document management for scheduling and organizational tasks.
						</p>
					</div>
				);

			case 4: // Team Leader
				return (
					<div>
						<h3 className="help_header">As a {getPositionName(userRecord.jobroleid)}</h3>
						<p className="help_paragraph">You can view and download public documents. Adding or removing documents is restricted.</p>
					</div>
				);

			case 5: // Worker
				return (
					<div>
						<h3 className="help_header">As a {getPositionName(userRecord.jobroleid)}</h3>
						<p className="help_paragraph">You can view and download public documents. Adding or removing documents is restricted</p>
					</div>
				);
			default: // Undefined
				return (
					<div>
						<h3 className="help_header">Access Notice</h3>
						<p className="help_paragraph">
							You can view and download public documents. However, adding or removing documents is restricted. Contact your administrator if access changes are required.
						</p>
					</div>
				);
		}
	};

	return (
		<>
			<SideNavigationBar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>
			<HelpIcon helpContent={getHelpContentBasedOnRole(getJobRoleId)} />
			<div className={FilesPageCSS.page_container}>
				<h1 className={FilesPageCSS.page_heading}>DOCUMENTS</h1>
				<div className={FilesPageCSS.page_content}>
					<FileListModal />
				</div>
			</div>
		</>
	);
};

export default FilesPage;
