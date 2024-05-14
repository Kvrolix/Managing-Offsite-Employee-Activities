import React, { useContext, useEffect, useState } from 'react';
import TasksPageCSS from './TasksPage.module.css';
import { formatDateTime } from '../../../context/helpers';
import { UserDataContext } from '../../../context/UserDataContext';

const TaskViewModal = ({ isOpen, task, onClose }) => {
	const { fetchUserByAuthId, fetchTeamById } = useContext(UserDataContext);
	const [createdByUser, setCreatedByUser] = useState('');
	const [assignedToUser, setAssignedToUser] = useState('');
	const [assignedToTeam, setAssignedToTeam] = useState('');

	useEffect(() => {
		if (task) {
			const getUserDetails = async () => {
				const user = await fetchUserByAuthId(task.createdbyauthid);
				if (user) {
					setCreatedByUser(`${user.firstname} ${user.surname}`);
				} else {
					setCreatedByUser('Not assigned');
				}
				// Fetching details for the assigned user
				const assignee = await fetchUserByAuthId(task.assignedtoauthid);
				if (assignee) {
					setAssignedToUser(`${assignee.firstname} ${assignee.surname}`);
				} else {
					setAssignedToUser('Not assigned');
				}
				const [teamData] = await fetchTeamById(task.assignedtoteamid);
				console.log(`teamdata:`, teamData);
				if (teamData) {
					const { teamname } = teamData;
					// console.log(teamData);
					setAssignedToTeam(`${teamname}`);
				} else {
					setAssignedToTeam('Not assigned');
				}
			};

			getUserDetails();
		}
	}, [task, fetchUserByAuthId]);

	if (!isOpen) return null;
	return (
		<div className={TasksPageCSS.modalBackdrop}>
			<div className={TasksPageCSS.modalContent}>
				<h2 className={TasksPageCSS.modalHeading}>View Task</h2>
				{/* TITLE */}
				<h3 className={TasksPageCSS.modalFieldTitle}>Title</h3>
				<p className={TasksPageCSS.modalInput}>{task.taskname}</p>
				{/* DESCRIPTION */}
				<h3 className={TasksPageCSS.modalFieldTitle}>Description</h3>
				<p className={TasksPageCSS.modalInput}>{task.description}</p>
				{/* DEADLINE */}
				<h3 className={TasksPageCSS.modalFieldTitle}>Deadline</h3>
				<p className={TasksPageCSS.modalInput}>{task.deadline}</p>
				{/* ASSIGNED TO PERSON */}
				<h3 className={TasksPageCSS.modalFieldTitle}>Assigned to Person</h3>
				<p className={TasksPageCSS.modalInput}>{assignedToUser}</p>
				{/* ASSIGNED TO TEAM */}
				<h3 className={TasksPageCSS.modalFieldTitle}>Assigned to Team</h3>
				<p className={TasksPageCSS.modalInput}>{assignedToTeam}</p>
				{/* CREATOR */}
				<h3 className={TasksPageCSS.modalFieldTitle}>Created by</h3>
				<p className={TasksPageCSS.modalInput}>{createdByUser}</p>
				{/* DATE CREATED */}
				<h3 className={TasksPageCSS.modalFieldTitle}>Date Created</h3>
				<p className={TasksPageCSS.modalInput}>{formatDateTime(task.datecreated)}</p>
				{/* <button
					className={`${TasksPageCSS.modalButton} ${TasksPageCSS.modalButton__cancel}`}
					onClick={onClose}>
					Close
				</button> */}

				<div
					className={`${TasksPageCSS.modal_button_close} `}
					onClick={onClose}>
					Close
				</div>
			</div>
		</div>
	);
};

export default TaskViewModal;
