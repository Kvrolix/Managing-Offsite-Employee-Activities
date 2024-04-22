import React, { useState } from 'react';
import TasksPageCSS from './TasksPage.module.css'; // Adjust the import path as necessary

export const formatDateTime = (isoString) => {
	const date = new Date(isoString);
	const time = date.toLocaleTimeString('en-UK', { hour: 'numeric', minute: '2-digit' });
	const dateFormatted = date.toLocaleDateString('en-UK');
	return `${time} on ${dateFormatted}`;
};

const getDeadlineColor = (deadline) => {
	const today = new Date();
	const dueDate = new Date(deadline);
	const timeDiff = dueDate - today;
	const daysDiff = timeDiff / (1000 * 3600 * 24); // Convert milliseconds to days

	if (daysDiff < 0) {
		return 'red'; // Overdue
	} else if (daysDiff <= 5) {
		return 'orange'; // Less than or equal to five days
	} else if (daysDiff <= 14) {
		return 'yellow'; // Less than two weeks but more than five days
	} else {
		return 'green'; // More than two weeks
	}
};

function truncateString(str, length) {
	if (str.length > length) {
		return str.substring(0, length) + ' Expand...';
	}
	return str;
}
const descriptionVisibleLength = 30;

const TaskElement = ({ title, description, dateCreated, deadline, assignedTo, onEdit, onArchive, onComplete, onView }) => {
	const [showOptions, setShowOptions] = useState(false);

	const formattedDate = formatDateTime(dateCreated);
	const deadlineColor = getDeadlineColor(deadline);

	const toggleOptions = () => setShowOptions(!showOptions);
	return (
		<>
			<div
				className={TasksPageCSS.task_card}
				onClick={toggleOptions}>
				<div
					className={TasksPageCSS.task_deadline_indicator}
					style={{ backgroundColor: deadlineColor }}
				/>
				<h2>{title}</h2>
				<p>{truncateString(description, descriptionVisibleLength)}</p>
				<div className={TasksPageCSS.task_info}>Deadline: {deadline}</div>
				<div className={TasksPageCSS.task_info}>Assigned to: {assignedTo}</div>
				<div className={TasksPageCSS.task_info}>Created: {formattedDate}</div>
				{showOptions && (
					<div className={TasksPageCSS.task_options}>
						<button onClick={onView}>View</button>
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
