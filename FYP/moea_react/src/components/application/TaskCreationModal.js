// const TaskCreationModal = ({ isOpen, onClose, onSave }) => {
// 	// Guard clause to not render the modal at all if it's not open
// 	if (!isOpen) return null;

// 	// Temporary state for form fields, adjust according to your needs
// 	const [title, setTitle] = useState('');
// 	const [description, setDescription] = useState('');
// 	const [deadline, setDeadline] = useState('');
// 	const [assignedTo, setAssignedTo] = useState('');

// 	// Handle saving the new task (placeholder function)
// 	const handleSave = () => {
// 		onSave({ title, description, deadline, assignedTo });
// 		onClose(); // Close modal after saving
// 	};

// 	return (
// 		<div className="modalBackdrop">
// 			<div className="modalContent">
// 				<h2>Create New Task</h2>
// 				<input
// 					type="text"
// 					placeholder="Title"
// 					value={title}
// 					onChange={(e) => setTitle(e.target.value)}
// 				/>
// 				<textarea
// 					placeholder="Description"
// 					value={description}
// 					onChange={(e) => setDescription(e.target.value)}
// 				/>
// 				<input
// 					type="date"
// 					value={deadline}
// 					onChange={(e) => setDeadline(e.target.value)}
// 				/>
// 				<input
// 					type="text"
// 					placeholder="Assigned To"
// 					value={assignedTo}
// 					onChange={(e) => setAssignedTo(e.target.value)}
// 				/>
// 				<button onClick={handleSave}>Save Task</button>
// 				<button onClick={onClose}>Cancel</button>
// 			</div>
// 		</div>
// 	);
// };
