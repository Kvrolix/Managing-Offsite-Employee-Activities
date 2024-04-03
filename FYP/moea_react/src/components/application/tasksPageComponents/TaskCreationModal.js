import React, { useState } from 'react';

import TasksPageCSS from './TasksPage.module.css';

const TaskCreationModal = ({ isOpen, onClose, onSave }) => {
	// Guard clause to not render the modal at all if it's not open
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [deadline, setDeadline] = useState('');
	const [assignedTo, setAssignedTo] = useState('');
	if (!isOpen) return null;

	// Temporary state for form fields, adjust according to your needs

	// Handle saving the new task (placeholder function)
	const handleSave = () => {
		onSave({ title, description, deadline, assignedTo });
		onClose(); // Close modal after saving
	};

	// TODO The date needs to be added automatically
	// TODO I will need to work somehow with assigning, maybe it will give the list as well from poeple to choose from like on supabase
	// TODO Add the success prompt as well
	return (
		<div className={TasksPageCSS.modalBackdrop}>
			<div className={TasksPageCSS.modalContent}>
				<h2 className={TasksPageCSS.modalHeading}>Create New Task</h2>
				<input
					className={TasksPageCSS.modalInput}
					type="text"
					placeholder="Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<textarea
					className={TasksPageCSS.modalTextarea}
					placeholder="Description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				<input
					className={TasksPageCSS.modalInput}
					type="date"
					value={deadline}
					onChange={(e) => setDeadline(e.target.value)}
				/>
				<input
					className={TasksPageCSS.modalInput}
					type="text"
					placeholder="Assigned To"
					value={assignedTo}
					onChange={(e) => setAssignedTo(e.target.value)}
				/>
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
			</div>
		</div>
	);
};

export default TaskCreationModal;
