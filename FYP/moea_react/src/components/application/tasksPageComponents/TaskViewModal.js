// TaskViewModal.js
import React, { useContext, useEffect, useState } from 'react';
import TasksPageCSS from './TasksPage.module.css';
import { formatDateTime } from '../../../context/helpers';
import { UserDataContext } from '../../../context/UserDataContext';

const TaskViewModal = ({ isOpen, task, onClose }) => {
	const { fetchUserByAuthId } = useContext(UserDataContext);
	const [createdByUser, setCreatedByUser] = useState('');
	const [assignedToUser, setAssignedToUser] = useState('');

	useEffect(() => {
		if (task) {
			const getUserDetails = async () => {
				const user = await fetchUserByAuthId(task.createdbyauthid);
				if (user) {
					setCreatedByUser(`${user.firstname} ${user.surname}`);
				} else {
					setCreatedByUser('Unknown User');
				}

				// Fetching details for the assigned user
				const assignee = await fetchUserByAuthId(task.assignedtoauthid);
				if (assignee) {
					setAssignedToUser(`${assignee.firstname} ${assignee.surname}`);
				} else {
					setAssignedToUser('Unknown User');
				}
			};

			getUserDetails();
		}
	}, [task, fetchUserByAuthId]);

	if (!isOpen) return null;
	return (
		<div className={TasksPageCSS.modalBackdrop}>
			<div className={TasksPageCSS.modalContent}>
				<h2>View Task</h2>
				<p>
					<strong>Title:</strong> {task.taskname}
				</p>
				<p>
					<strong>Description:</strong> {task.description}
				</p>
				<p>
					<strong>Deadline:</strong> {task.deadline}
				</p>
				<p>
					<strong>Assigned To:</strong> {assignedToUser}
				</p>
				<p>
					<strong>Created by:</strong> {createdByUser}
				</p>
				<p>
					<strong>Date Created:</strong> {formatDateTime(task.datecreated)}
				</p>
				<button onClick={onClose}>Close</button>
			</div>
		</div>
	);
};

export default TaskViewModal;
