import React, { useState } from 'react';
import TasksPageCSS from './TasksPage.module.css'; // Adjust the import path as necessary

const formatDateTime = (isoString) => {
	const date = new Date(isoString);
	const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
	const dateFormatted = date.toLocaleDateString('en-US');
	return `${time} on ${dateFormatted}`;
};

const TaskElement = ({ title, description, dateCreated, deadline, assignedTo, onEdit, onArchive, onComplete }) => {
	const [showOptions, setShowOptions] = useState(false);

	const formattedDate = formatDateTime(dateCreated);

	const toggleOptions = () => setShowOptions(!showOptions);
	return (
		<>
			<div
				className={TasksPageCSS.task_card}
				onClick={toggleOptions}>
				<h2>{title}</h2>
				<p>{description}</p>
				<div className={TasksPageCSS.task_info}>Deadline: {deadline}</div>
				<div className={TasksPageCSS.task_info}>Assigned to: {assignedTo}</div>
				<div className={TasksPageCSS.task_info}>Created: {formattedDate}</div>
				{showOptions && (
					<div className={TasksPageCSS.task_options}>
						<button onClick={onComplete}>Complete</button>
						<button onClick={onEdit}>Edit</button>
						<button onClick={onArchive}>Archive</button>
						<button onClick={toggleOptions}>Close</button>
					</div>
				)}
			</div>
		</>
	);
};

export default TaskElement;
