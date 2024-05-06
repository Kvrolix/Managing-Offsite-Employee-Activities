// React
import React, { useContext } from 'react';
import { useAppNavigate } from '../../../context/useAppNavigate.js';

// Styles
import DashboardOptionsCSS from './DashboardOptions.module.css';

// Data
import { UserDataContext } from '../../../context/UserDataContext.js';

// Components
// TODO export it to a different file as there will be too many of them soon
const DashboardElement = ({ icon, text, navigateTo }) => (
	<div
		className={DashboardOptionsCSS.dashboard_element}
		onClick={navigateTo}>
		<div className={DashboardOptionsCSS.dashboard_icon}>
			<span className="material-icons md-36">{icon}</span>
		</div>
		<p>{text}</p>
	</div>
);

// TODO Add hover option that the element will go even more up
// TODO Add functionality for map and calendar, and other buttons
// TODO Use Google icons eveythere and for the organization icon apply the briefcase
// TODO Fix the screen as when the sidebar is used the screen is changing too.
// TODO Update the dashboard to look better add the animations too

const DashboardOptions = ({ isSidebarOpen }) => {
	const { userRecord } = useContext(UserDataContext);
	const { navigateToTasks, navigateToOrganization, navigateToUsers } = useAppNavigate();

	// Ensure userRecord exists before trying to access its properties
	if (!userRecord) {
		// Render a loading message or null if userRecord is not yet available
		return null;
	}

	const { firstname, surname } = userRecord;

	return (
		<>
			<div className={`${DashboardOptionsCSS.options_container}  ${isSidebarOpen ? DashboardOptionsCSS.expanded : DashboardOptionsCSS.collapsed}`}>
				<h2 className={DashboardOptionsCSS.greeting}>{`Welcome, ${firstname}!`}</h2>
				<div className={DashboardOptionsCSS.dashboard_grid}>
					<div className={`grid ${DashboardOptionsCSS.dashboard_goto}`}>
						{/* TASKS */}
						<DashboardElement
							icon="assignment"
							text="Tasks"
							navigateTo={navigateToTasks}
						/>
						{/* TEAMS */}
						<DashboardElement
							icon="supervised_user_circle"
							text="Teams"
						/>
						{/* CHAT */}
						<DashboardElement
							icon="question_answer"
							text="Chat"
						/>
						{/* FILES */}
						<DashboardElement
							icon="description"
							text="Files"
						/>
						{/* USERS */}
						<DashboardElement
							icon="group"
							text="Users"
							navigateTo={navigateToUsers}
						/>
						{/* ORGANIZATION */}
						<DashboardElement
							icon="hub"
							text="Organization"
							navigateTo={navigateToOrganization}
						/>
					</div>
					<div className={DashboardOptionsCSS.dashboard_calendar}>Calendar</div>
					<div className={DashboardOptionsCSS.dashboard_map}>Map</div>
				</div>
			</div>
		</>
	);
};

export default DashboardOptions;
