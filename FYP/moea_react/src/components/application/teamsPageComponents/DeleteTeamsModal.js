import React from 'react';
import TeamsPageCSS from './TeamsPage.module.css';
const DeleteTeamsModal = ({ isOpen, onClose }) => {
	if (!isOpen) return null;
	return (
		<>
			<div className={TeamsPageCSS.modal_backdrop}>
				<h2>DELETE TEAMS MODAL</h2>
			</div>
		</>
	);
};

export default DeleteTeamsModal;
