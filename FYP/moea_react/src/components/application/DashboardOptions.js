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
	const { user, userRecord, error } = useContext(UserDataContext); // Accessing context values
	// console.log(`Data from dashboardOptions:`, user);

	const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	delay(1000);
	const [{ firstname, surname }] = userRecord;
	// try {
	// 	// delay(1000);
	// 	const [{ firstname, surname }] = userRecord;
	// 	console.log(`DashboardOptions:`, userRecord);
	// 	console.log(firstname);
	// } catch (error) {
	// 	console.error(error);
	// }

	// BUG Id should not be shared
	// const [{ firstname, surname }] = userRecord;
	// Conditional rendering to ensure userRecord is not null
	if (!userRecord) {
		console.log('error with user record'); // or any other loading state representation
	}

	// Now safe to destructure since we checked userRecord is not null/undefined
	// const { firstname, surname } = userRecord;

	useEffect(() => {
		// Effect for doing something when user or error changes
		if (error) {
			console.error(error);
		}
		if (user) {
			// console.log('User from context:', user);
			// Perform any action based on the user data
		}
	}, [user, error]);

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
