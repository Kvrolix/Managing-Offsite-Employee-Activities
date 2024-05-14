// React
import React, { useContext, useState } from 'react';

// CSS
import TeamsPageCSS from '../components/application/teamsPageComponents/TeamsPage.module.css';

// Components
import SideNavigationBar from '../components/application/sideBarComponents/SideNaviagtionBar';
import AddTeamModal from '../components/application/teamsPageComponents/AddTeamModal';
import ViewTeamsModal from '../components/application/teamsPageComponents/ViewTeamsModal';
import EditTeamsModal from '../components/application/teamsPageComponents/EditTeamsModal';
import DeleteTeamsModal from '../components/application/teamsPageComponents/DeleteTeamsModal';
import HelpIcon from '../components/application/HelpIcon';

// Data
import { UserDataContext } from '../context/UserDataContext';
import { getPositionName } from '../context/helpers';
import { ROLES } from '../context/roles';

const TeamsPage = () => {
	const [isAddTeamsModalOpen, setIsAddTeamsModalOpen] = useState(false);
	const [isViewTeamsModalOpen, setIsViewTeamsModalOpen] = useState(false);
	const [isEditTeamsModalOpen, setIsEditTeamsModalOpen] = useState(false);
	const [isDeleteTeamsModalOpen, setIsDeleteTeamsModalOpen] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const { userRecord } = useContext(UserDataContext);

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

	const getJobRole = userRecord.jobroleid;
	const getHelpContentBasedOnRole = (jobRole) => {
		const higherPosition = () => {
			return (
				<>
					<div>
						<h3 className="help_header">As a {getPositionName(userRecord.jobroleid)}</h3>
						<p className="help_paragraph">
							You are empowered with extensive team management capabilities such as:
							<ol className="help_list_numbered">
								<li>Establishing new teams to meet departmental goals</li>
								<li>Accessing comprehensive views of all teams within your preview</li>
								<li>Making adjustments to team structures or member roles through the edit function</li>
								<li>Disbanding teams when they are no longer functional or required</li>
							</ol>
						</p>
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
				return (
					<div>
						<h3 className="help_header">As a {getPositionName(userRecord.jobroleid)}</h3>
						<p className="help_paragraph">You are empowered with the following team management capabilities:</p>
						<ol className="help_list_numbered">
							<li>Accessing comprehensive views of all teams within your preview</li>
							<li>Making adjustments to team structures or member roles through the edit function</li>
						</ol>
					</div>
				);

			case 4: // Team Leader
				return (
					<div>
						<h3 className="help_header">As a {getPositionName(userRecord.jobroleid)}</h3>
						<p className="help_paragraph">
							Your interaction with the Teams page is limited to viewing. This access allows you to see the structure and members of the teams within the organization, which can inform your strategies
							and collaborations.
						</p>
					</div>
				);

			case 5: // Worker
				return (
					<div>
						<h3 className="help_header">As a {getPositionName(userRecord.jobroleid)}</h3>
						<p className="help_paragraph">
							Your interaction with the Teams page is limited to viewing. This access allows you to see the structure and members of the teams within the organization, which can inform your strategies
							and collaborations.
						</p>
					</div>
				);

			default: // Undefined
				return (
					<div>
						<p className="help_paragraph">
							You do not have access to the Teams page. This measure ensures data privacy and management efficiency. For any inquiries or detailed information about team structures or your role within
							a team, please direct your questions to your direct supervisor or the HR department.
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
			<HelpIcon helpContent={getHelpContentBasedOnRole(getJobRole)} />
			<div className={TeamsPageCSS.page_container}>
				<h1 className={TeamsPageCSS.page_heading}>TEAMS</h1>
				<div className={TeamsPageCSS.content}>
					<div className={TeamsPageCSS.content_grid}>
						{[ROLES.CHIEF, ROLES.MANAGER, ROLES.SECRETARY].includes(userRecord.jobroleid) && (
							<>
								<ContentElement
									icon="group_add"
									text="Create Team"
									navigateTo={() => setIsAddTeamsModalOpen(true)}
								/>
							</>
						)}
						<ContentElement
							icon="conditions"
							text="View Teams"
							navigateTo={() => setIsViewTeamsModalOpen(true)}
						/>
						{[ROLES.CHIEF, ROLES.MANAGER, ROLES.SECRETARY].includes(userRecord.jobroleid) && (
							<>
								<ContentElement
									icon="edit_note"
									text="Edit Teams"
									navigateTo={() => setIsEditTeamsModalOpen(true)}
								/>
								<ContentElement
									icon="group_remove"
									text="Delete Team"
									navigateTo={() => setIsDeleteTeamsModalOpen(true)}
								/>
							</>
						)}
					</div>
				</div>
			</div>
			<DeleteTeamsModal
				isOpen={isDeleteTeamsModalOpen}
				onClose={() => setIsDeleteTeamsModalOpen(false)}
			/>
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
