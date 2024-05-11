// React
import React, { useContext, useState, useEffect } from 'react';
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
	const { navigateToTasks, navigateToOrganization, navigateToUsers, navigateToChat, navigateToTeams, navigateToMap, navigateToFiles } = useAppNavigate();

	if (!userRecord) {
		return null;
	}

	const { firstname } = userRecord;

	const CalendarComponent = () => {
		const [currentTime, setCurrentTime] = useState(new Date());

		useEffect(() => {
			const timerId = setInterval(() => {
				setCurrentTime(new Date()); // Update time every second
			}, 1000);

			return () => clearInterval(timerId);
		}, []);

		const dayName = currentTime.toLocaleString('en-UK', { weekday: 'long' });
		const dateStr = currentTime.toLocaleDateString('en-UK', { year: 'numeric', month: 'long', day: 'numeric' });
		const timeStr = currentTime.toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

		return (
			<div className={DashboardOptionsCSS.calendar}>
				<div className={DashboardOptionsCSS.dayName}>{dayName}</div>
				<div className={DashboardOptionsCSS.dateStr}>{dateStr}</div>
				<div className={DashboardOptionsCSS.timeStr}>{timeStr}</div>
			</div>
		);
	};

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
							navigateTo={navigateToTeams}
						/>
						{/* CHAT */}
						<DashboardElement
							icon="question_answer"
							text="Chat"
							navigateTo={navigateToChat}
						/>
						{/* FILES */}
						<DashboardElement
							icon="description"
							text="Files"
							navigateTo={navigateToFiles}
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
					<CalendarComponent />
					<div
						className={DashboardOptionsCSS.dashboard_map}
						onClick={navigateToMap}></div>
				</div>
			</div>
		</>
	);
};

export default DashboardOptions;
