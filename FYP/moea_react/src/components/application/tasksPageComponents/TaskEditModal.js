import React, { useState, useEffect } from 'react';
import TasksPageCSS from './TasksPage.module.css';
import { getPositionName } from '../../../context/helpers';
const TaskEditModal = ({ isOpen, onClose, onSave, task, employees, teams }) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [deadline, setDeadline] = useState('');
	const [assignedtoauthid, setAssignedToAuthId] = useState('');
	const [assignedToTeamId, setAssignedToTeamId] = useState('');

	console.log(teams);
	console.log(employees);
	useEffect(() => {
		if (task) {
			setTitle(task.taskname);
			setDescription(task.description);
			setDeadline(task.deadline);
			setAssignedToAuthId(task.assignedtoauthid);
			setAssignedToTeamId(task.assignedToTeamId);
		}
	}, [task]);

	const handleSubmit = (e) => {
		e.preventDefault();
		onSave({
			taskname: title,
			description,
			deadline,
			assignedtoauthid,
			assignedtoteamid: assignedToTeamId,
		});
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className={TasksPageCSS.modalBackdrop}>
			<div className={TasksPageCSS.modalContent}>
				<h2 className={TasksPageCSS.modalHeading}>Edit Task</h2>
				<form onSubmit={handleSubmit}>
					<div className={TasksPageCSS.modalFieldTitle}>Title</div>
					<input
						className={TasksPageCSS.modalInput}
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
					<div className={TasksPageCSS.modalFieldTitle}>Description</div>
					<textarea
						className={TasksPageCSS.modalInput}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
					<div className={TasksPageCSS.modalFieldTitle}>Deadline</div>
					<input
						className={TasksPageCSS.modalInput}
						type="date"
						value={deadline}
						onChange={(e) => setDeadline(e.target.value)}
						required
					/>
					<div className={TasksPageCSS.modalFieldTitle}>Assigned to Person (Optional)</div>
					<select
						className={TasksPageCSS.modalInput}
						value={assignedtoauthid}
						onChange={(e) => setAssignedToAuthId(e.target.value)}>
						<option value="">Select Person...</option>
						{employees.map((employee) => (
							<option
								key={employee.authid}
								value={employee.authid}>
								{`${employee.firstname} ${employee.surname},  ${getPositionName(employee.jobroleid)}`}
							</option>
						))}
					</select>
					<div className={TasksPageCSS.modalFieldTitle}>Assigned to Team</div>
					<select
						className={TasksPageCSS.modalInput}
						value={assignedToTeamId}
						onChange={(e) => setAssignedToTeamId(e.target.value)}>
						<option value="">Select Team...</option>
						{teams.map((team) => (
							<option
								key={team.teamid}
								value={team.teamid}>
								{team.teamname}
							</option>
						))}
					</select>
					<div className={TasksPageCSS.modalButtonGroup}>
						<button
							className={`${TasksPageCSS.modalButton} ${TasksPageCSS.modalButton__save}`}
							type="submit">
							Update Task
						</button>
						<button
							className={`${TasksPageCSS.modalButton} ${TasksPageCSS.modalButton__cancel}`}
							onClick={onClose}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default TaskEditModal;
