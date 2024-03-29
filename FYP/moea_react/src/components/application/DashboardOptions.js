import React, { useContext, useEffect } from 'react';
import DashboardOptionsCSS from './DashboardOptions.module.css';
import SideNavigationBarCSS from './SideNavigationBar.module.css';

import { UserDataContext } from '../../context/UserDataContext';

const DashboardElement = ({ icon, text }) => (
	<div className={DashboardOptionsCSS.dashboard_element}>
		<div className="dashboard-icon">
			<span className="material-icons md-36">{icon}</span>
		</div>
		<p>{text}</p>
	</div>
);

// TODO Add hover option that the element will go even more up
// TODO Add functionality for map and calendar, and other buttons
// TODO Use Google icons eveythere and for the organization icon apply the briefcase
// TODO Fix the screen as when the sidebar is used the screen is changing too.

const DashboardOptions = ({ isSidebarOpen }) => {
	const { user, userRecord, error } = useContext(UserDataContext);

	// Ensure userRecord exists before trying to access its properties
	if (!userRecord) {
		// Render a loading message or null if userRecord is not yet available
		return (
			<>
				<div>Loading user details...</div>
			</>
		);
	}
	// Now it's safe to destructure userRecord as it's guaranteed to be non-null
	const { firstname, surname } = userRecord;

	return (
		<>
			<div className={`${DashboardOptionsCSS.options_container}  ${isSidebarOpen ? DashboardOptionsCSS.expanded : DashboardOptionsCSS.collapsed}`}>
				<h2 className={DashboardOptionsCSS.greeting}>{`Welcome, ${firstname} ${surname}!`}</h2>
				<div className={DashboardOptionsCSS.dashboard_grid}>
					<div className={`grid ${DashboardOptionsCSS.dashboard_goto}`}>
						<DashboardElement
							icon="assignment"
							text="Tasks"
						/>
						<DashboardElement
							icon="supervised_user_circle"
							text="Teams"
						/>
						<DashboardElement
							icon="question_answer"
							text="Chat"
						/>
						<DashboardElement
							icon="description"
							text="Files"
						/>
						<DashboardElement
							icon="group"
							text="Users"
						/>
						<DashboardElement
							icon="hub"
							text="Organization"
						/>
					</div>
					<div className={DashboardOptionsCSS.dashboard_calendar}>element 2</div>
					<div className={DashboardOptionsCSS.dashboard_map}></div>
				</div>
			</div>
		</>
	);
};

export default DashboardOptions;
