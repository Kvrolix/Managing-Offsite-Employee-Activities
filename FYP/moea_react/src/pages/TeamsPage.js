import React, { useState } from 'react';
import SideNavigationBar from '../components/application/sideBarComponents/SideNaviagtionBar';
import TeamsPageCSS from '../components/application/teamsPageComponents/TeamsPage.module.css';
import AddTeamModal from '../components/application/teamsPageComponents/AddTeamModal';
import ViewTeamsModal from '../components/application/teamsPageComponents/ViewTeamsModal';
import EditTeamsModal from '../components/application/teamsPageComponents/EditTeamsModal';
const TeamsPage = () => {
	const [isAddTeamsModalOpen, setIsAddTeamsModalOpen] = useState(false);
	const [isViewTeamsModalOpen, setIsViewTeamsModalOpen] = useState(false);
	const [isEditTeamsModalOpen, setIsEditTeamsModalOpen] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const ContentElement = ({ icon, text, navigateTo }) => (
		<div
			className={TeamsPageCSS.content_element}
			onClick={navigateTo}>
			<div className={TeamsPageCSS.content_icon}>
				<span class="material-symbols-outlined">{icon}</span>
			</div>
			<p>{text}</p>
		</div>
	);
	return (
		<>
			<SideNavigationBar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>
			<div className={TeamsPageCSS.page_container}>
				<h1 className={TeamsPageCSS.page_heading}>TEAMS PAGE</h1>
				<div className={TeamsPageCSS.content}>
					<div className={TeamsPageCSS.content_grid}>
						<ContentElement
							icon="group_add"
							text="Add Team"
							navigateTo={() => setIsAddTeamsModalOpen(true)}
						/>
						<ContentElement
							icon="conditions"
							text="View Teams"
							navigateTo={() => setIsViewTeamsModalOpen(true)}
						/>
						<ContentElement
							icon="edit_note"
							text="Edit Teams"
							navigateTo={() => setIsEditTeamsModalOpen(true)}
						/>
						<ContentElement
							icon="group_remove"
							text="Delete Team"
							// navigateTo={() => setIsViewUsersModalOpen(true)}
						/>
					</div>
				</div>
			</div>
			<AddTeamModal
				isOpen={isAddTeamsModalOpen}
				onClose={() => setIsAddTeamsModalOpen(false)}
			/>
			<ViewTeamsModal
				isOpen={isViewTeamsModalOpen}
				onClose={() => setIsViewTeamsModalOpen(false)}
			/>
			<EditTeamsModal
				isOpen={isEditTeamsModalOpen}
				onClose={() => setIsEditTeamsModalOpen(false)}
			/>
		</>
	);
};

export default TeamsPage;
