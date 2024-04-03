import React from 'react';

import TasksPageCSS from './TasksPage.module.css';
const SuccessNotification = ({ message, isVisible, onClose }) => {
	if (!isVisible) return null;
	return (
		<>
			<div className={TasksPageCSS.successNotification}>
				<span>{message}</span>
				<button
					className={TasksPageCSS.notificationCloseButton}
					onClick={onClose}></button>
			</div>
		</>
	);
};

export default SuccessNotification;
