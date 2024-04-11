import React, { useState } from 'react';

import TasksPageCSS from './TasksPage.module.css';

const TaskCreationModal = ({ isOpen, onClose, onSave, employees }) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [deadline, setDeadline] = useState('');
	const [assignedToPerson, setAssignedToPerson] = useState('');
	const [assignedToTeam, setAssignedToTeam] = useState('');

	if (!isOpen) return null;

	const handleSave = () => {
		if (!title.trim() || !description.trim() || !deadline.trim() || (assignedToPerson.trim() === '' && assignedToTeam.trim() === '')) {
			console.error('Title, description, deadline are required, and either a person or a team must be selected.');

			return;
		}
		onSave({ title, description, deadline, assignedToPerson, assignedToTeam });
		setTitle('');
		setDescription('');
		setDeadline('');
		setAssignedToPerson('');
		setAssignedToTeam('');
		onClose(); // Close modal after saving
	};

	// TODO The date needs to be added automatically
	// TODO I will need to work somehow with assigning, maybe it will give the list as well from poeple to choose from like on supabase
	// TODO Add the Negative prompt
	return (
		<div className={TasksPageCSS.modalBackdrop}>
			<div className={TasksPageCSS.modalContent}>
				<h2 className={TasksPageCSS.modalHeading}>Create New Task</h2>
				<form
					onSubmit={(e) => {
						e.preventDefault(); // Prevent the default form submission
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
						required //BUG
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
						<option value="">Select Team...</option>
						{/* TODO */}
						{/* {teams.map(team => (
                        <option key={team.TeamID} value={team.TeamID}>{team.TeamName}</option>
                    ))} */}
					</select>

					<div className={TasksPageCSS.modalFieldTitle}>Assigned to Person (Optional)</div>
					<select
						className={TasksPageCSS.modalInput}
						value={assignedToPerson}
						onChange={(e) => setAssignedToPerson(e.target.value)}>
						<option value="">Select Person...</option>
						{employees.map((employee) => (
							<option
								key={employee.authid}
								value={employee.authid}>
								{employee.firstname} {employee.surname} {`, Job Role: ${employee.jobroleid}`}
							</option>
						))}
					</select>
					{/* TODO Datacreated is a timestamp */}
					<div className={TasksPageCSS.modalButtonGroup}>
						<button
							className={`${TasksPageCSS.modalButton} ${TasksPageCSS.modalButton__save}`}
							onClick={handleSave}>
							Save Task
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

export default TaskCreationModal;
