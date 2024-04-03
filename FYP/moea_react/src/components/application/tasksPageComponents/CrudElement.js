import React from 'react';
import TasksPageCSS from './TasksPage.module.css'; // Adjust the import path as necessary

// const CrudElement = ({ icon, color, onClick }) => (
// 	<div
// 		className={`${TasksPageCSS.crud_icon} ${color}`}
// 		onClick={onClick}>
// 		<span class="material-icons md-36">{icon}</span>
// 	</div>
// );

const CrudElement = ({ icon, color, onClick }) => {
	return (
		<>
			<div
				className={`${TasksPageCSS.crud_icon} ${color}`}
				onClick={onClick}>
				<span class="material-icons md-36">{icon}</span>
			</div>
		</>
	);
};

export default CrudElement;
