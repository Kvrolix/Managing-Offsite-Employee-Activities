import React from 'react';
import TasksPageCSS from './TasksPage.module.css';

const ArchiveRow = ({ title, description, deadline, assignedTo }) => {
	return (
		<>
			<tr>
				<td>{title}</td>
				<td>{description}</td>
				<td>{deadline}</td>
				<td>{assignedTo}</td>
			</tr>
		</>
	);
};

export default ArchiveRow;

// const ArchiveRow = ({ title, description, deadline, assignedTo }) => (
// 	<tr>
// 		<td>{title}</td>
// 		<td>{description}</td>
// 		<td>{deadline}</td>
// 		<td>{assignedTo}</td>
// 	</tr>
// );
