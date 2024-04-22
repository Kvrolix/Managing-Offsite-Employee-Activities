import React, { useState, useEffect } from 'react';
import TasksPageCSS from './TasksPage.module.css';
const TaskEditModal = ({ isOpen, onClose, onSave, task, employees }) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [deadline, setDeadline] = useState('');
	const [assignedtoauthid, setAssignedToAuthId] = useState('');

	useEffect(() => {
		if (task) {
			setTitle(task.taskname);
			setDescription(task.description);
			setDeadline(task.deadline);
			setAssignedToAuthId(task.assignedtoauthid);
		}
	}, [task]);

	const handleSubmit = (e) => {
		e.preventDefault();
		onSave({
			taskname: title,
			description,
			deadline,
			assignedtoauthid,
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
								{employee.firstname} {employee.surname} {`, Job Role: ${employee.jobroleid}`}
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
