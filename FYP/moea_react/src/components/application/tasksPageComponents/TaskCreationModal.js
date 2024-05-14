import React, { useState } from 'react';

import TasksPageCSS from './TasksPage.module.css';
import Spinner from '../Spinner';

const TaskCreationModal = ({ isOpen, onClose, onSave, employees, teams, loading, setLoading }) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [deadline, setDeadline] = useState('');
	const [assignedToPerson, setAssignedToPerson] = useState('');
	const [assignedToTeam, setAssignedToTeam] = useState('');

	if (!isOpen) return null;

	const handleSave = () => {
		if (!title.trim() || !description.trim() || !deadline.trim()) {
			console.error('Title, description, and deadline are required.');
			return;
		}

		// It is used to prevent from working
		const assignedPerson = assignedToPerson && assignedToPerson !== 'NULL' ? assignedToPerson : null;
		const assignedTeam = assignedToTeam && assignedToTeam !== 'NULL' ? assignedToTeam : null;

		if (!assignedPerson && !assignedTeam) {
			console.error('Either a person or a team must be selected.');
			return;
		}

		setLoading(true);
		onSave({ title, description, deadline, assignedToPerson: assignedPerson, assignedToTeam: assignedTeam });
		setLoading(false);
		setTitle('');
		setDescription('');
		setDeadline('');
		setAssignedToPerson('');
		setAssignedToTeam('');
		onClose();
	};

	// TODO Add the Negative prompt
	return (
		<div className={TasksPageCSS.modalBackdrop}>
			{loading && <Spinner />}
			<div className={TasksPageCSS.modalContent}>
				<h2 className={TasksPageCSS.modalHeading}>Create New Task</h2>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSave();
					}}>
					{/* TITLE */}
					<div className={TasksPageCSS.modalFieldTitle}>Title</div>
					<input
						className={TasksPageCSS.modalInput}
						type="text"
						placeholder="Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>

					{/* DESCRIPTION */}
					<div className={TasksPageCSS.modalFieldTitle}>Description</div>
					<textarea
						className={TasksPageCSS.modalTextarea}
						required
						placeholder="Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					{/* DEADLINE */}
					<div className={TasksPageCSS.modalFieldTitle}>Deadline</div>
					<input
						className={TasksPageCSS.modalInput}
						type="date"
						required
						value={deadline}
						onChange={(e) => setDeadline(e.target.value)}
					/>
					{/* ASSIGNED TO TEAM */}

					<div className={TasksPageCSS.modalFieldTitle}>Assigned to Team</div>
					<select
						className={TasksPageCSS.modalInput}
						required
						value={assignedToTeam}
						onChange={(e) => setAssignedToTeam(e.target.value)}>
						<option value="NULL">Select Team...</option>
						{Object.entries(teams).map((team) => (
							<option
								key={parseInt(team[0])}
								value={parseInt(team[0])}>
								{`${team[1]}`}
							</option>
						))}
					</select>

					<div className={TasksPageCSS.modalFieldTitle}>Assigned to Person (Optional)</div>
					<select
						className={TasksPageCSS.modalInput}
						value={assignedToPerson}
						onChange={(e) => setAssignedToPerson(e.target.value)}>
						<option value="NULL">Select Person...</option>
						{employees.map((employee) => (
							<option
								key={employee.authid}
								value={employee.authid}>
								{employee.firstname} {employee.surname} {`, Job Role: ${employee.jobroleid}`}
							</option>
						))}
					</select>
					<div className={TasksPageCSS.modal_buttons_group}>
						<div
							className={`${TasksPageCSS.modal_button_save}`}
							onClick={handleSave}>
							Save Task
						</div>

						<div
							className={`${TasksPageCSS.modal_button_close}`}
							onClick={onClose}>
							Cancel
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default TaskCreationModal;
