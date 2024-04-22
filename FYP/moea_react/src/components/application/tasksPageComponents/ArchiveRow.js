import React from 'react';

const ArchiveRow = ({ title, description, deadline, taskid, assignedTo }) => {
	return (
		<>
			<tr>
				<td>{title}</td>
				<td>{description}</td>
				<td>{deadline}</td>
				<td>{assignedTo}</td>
				<td>{taskid}</td>
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
