import React from 'react';
import TasksPageCSS from './TasksPage.module.css'; // Adjust the import path as necessary

const TaskElement = ({ title, description, deadline, assignedTo }) => {
	return (
		<>
			<div className={TasksPageCSS.task_card}>
				{/* Adjust CSS class reference as necessary */}
				<h2>{title}</h2>
				<p>{description}</p>
				<div className={TasksPageCSS.task_info}>Deadline: {deadline}</div>
				<div className={TasksPageCSS.task_info}>Assigned To: {assignedTo}</div>
			</div>
		</>
	);
};

export default TaskElement;
