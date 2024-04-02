// React
import React, { useState } from 'react';

// Styles
import SideNavigationBar from '../components/application/SideNaviagtionBar';
import TasksPageCSS from './TasksPage.module.css';

// Data
import { UserDataProvider } from '../context/UserDataContext';

const TaskElement = ({ title, description, dateCreated, deadline, assignedTo }) => (
	<div className={TasksPageCSS.task_card}>
		<h2>Task Title</h2>
		<p>Description of the taskDescription of the taskDescription of the taskDescription of the taskDescription of the task </p>
		<div className={TasksPageCSS.task_info}>deadline: 06/03/2024</div>
		<div className={TasksPageCSS.task_info}>AssignedTo: Karolo Zigolo</div>
	</div>
);

const CrudElement = ({ icon, color }) => {};
const TasksPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};
	// TODO This section
	// I will want te task creator have the same top for creating deleting etc.
	// But for the task itself I will have it in form of cards
	// The done Tasks will be in the list format or a table this should be exported via pdf so the button would be created
	// TODO I need to create a big container, that will be adjusting itself based wether the sidebar is open is not

	// TODO Create a card element for a task
	// TODO Create icon element for the task creation etc.
	// TODO Create the table for the archives
	// TODO Create the prompt about sucessfull/unsucessfull Task generation
	// TODO Task can be only deleted from the archives
	// TODO Add functionlity that based on the date how close to deadline it is there will be a red circle printed on the card

	return (
		<>
			<UserDataProvider>
				<SideNavigationBar
					isSidebarOpen={isSidebarOpen}
					toggleSidebar={toggleSidebar}
				/>

				<div className={TasksPageCSS.container_tasks}>
					<h1 className={TasksPageCSS.tasks_heading}>Task Manager</h1>
					<ul>
						<li>create</li>
						<li>edit</li>
						<li>delete</li>
					</ul>
					<div className={TasksPageCSS.tasks_grid}>
						<TaskElement />
						<TaskElement />
						<TaskElement />
						<TaskElement />
						<TaskElement />
						<TaskElement />
						<TaskElement />
						<TaskElement />
					</div>
					<h2>Archives</h2>
					<div>There will be a table with all the archives, it will collapse once pressed to reduce the usage of space</div>
				</div>
			</UserDataProvider>
		</>
	);
};

export default TasksPage;
