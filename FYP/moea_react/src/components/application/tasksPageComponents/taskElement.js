import React from 'react';
import TasksPageCSS from './TasksPage.module.css'; // Adjust the import path as necessary

const TaskElement = ({ title, description, deadline, assignedTo }) => {
	return (
		<>
			<div className={TasksPageCSS.task_card}>
				<h2>{title}</h2>
				<p>{description}</p>
				<div className={TasksPageCSS.task_info}>Deadline: {deadline}</div>
				<div className={TasksPageCSS.task_info}>Assigned to: {assignedTo}</div>
				<div>
					<i className="bx bx-x"></i>
				</div>
			</div>
		</>
	);
};

export default TaskElement;
