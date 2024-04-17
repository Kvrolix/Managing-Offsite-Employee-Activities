import React from 'react';

import TasksPageCSS from './TasksPage.module.css';
const SuccessNotification = ({ message, isVisible, onClose, undo }) => {
	if (!isVisible) return null;
	return (
		<>
			<div className={TasksPageCSS.successNotification}>
				<span>{message}</span>
				{undo && <button onClick={undo}>Undo</button>}
				<button
					className={TasksPageCSS.notificationCloseButton}
					onClick={onClose}></button>
			</div>
		</>
	);
};

export default SuccessNotification;
