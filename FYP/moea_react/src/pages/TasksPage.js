// React
import React, { useState, useContext, useEffect } from 'react';

// Styles
import TasksPageCSS from '../components/application/tasksPageComponents/TasksPage.module.css';

// Data
import { UserDataContext } from '../context/UserDataContext';
import supabase from '../config/supabaseClient';

// Components
import SideNavigationBar from '../components/application/SideNaviagtionBar';
import TaskElement from '../components/application/tasksPageComponents/taskElement';
import CrudElement from '../components/application/tasksPageComponents/CrudElement';
import ArchiveRow from '../components/application/tasksPageComponents/ArchiveRow';
import SuccessNotification from '../components/application/tasksPageComponents/SuccessNotification';

// Modals
import TaskCreationModal from '../components/application/tasksPageComponents/TaskCreationModal';
import TaskViewModal from '../components/application/tasksPageComponents/TaskViewModal';

// TODO go through the records in a list so they are all visible and depends who you pick it will get his authid and this will be assigned to a created task
// BUG When page realods it waits longser for getting the assigned to as it is another call, to it should all be printed in teh same time \
const TasksPage = () => {
	// DATA
	const { userRecord, tasks, fetchTasks, employeesForTask, fetchUserByAuthId } = useContext(UserDataContext);

	// Modals and rendering states
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showSuccessNotification, setShowSuccessNotification] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [currentUndoTimeout, setCurrentUndoTimeout] = useState(null);
	const [currentTask, setCurrentTask] = useState(null);

	// // Modal functions
	// const closeModal = () => setIsModalOpen(false);
	// const openModal = () => setIsModalOpen(true);

	const closeNotification = () => {
		setShowSuccessNotification(false);
	};

	// Pagination
	// TODO

	const openCreateModal = () => {
		setIsCreateModalOpen(true); // Specific to the creation modal
	};

	const closeCreateModal = () => {
		setIsCreateModalOpen(false);
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const [viewingTask, setViewingTask] = useState(null);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Rename the existing state for clarity if it was `isModalOpen`

	const openViewModal = (task) => {
		setViewingTask(task);
		setIsViewModalOpen(true); // Specific to the view modal
	};

	const closeViewModal = () => {
		setIsViewModalOpen(false);
		setViewingTask(null);
	};

	const editTask = (taskId) => {
		console.log('Editing task:', taskId);
		// Placeholder for edit task functionality
	};

	// const archiveTask = (taskId) => {
	// 	console.log('Archiving task:', taskId);
	// 	// Placeholder for archive task functionality
	// };
	const archiveTask = async (task) => {
		try {
			// Update task status to archived and completed in Supabase
			const { error } = await supabase.from('task').update({ isCompleted: true, isArchived: true }).eq('taskid', task.taskid);
			console.log(`Archived Task:`, task.taskid);

			if (error) throw error;

			// UI Feedback
			setSuccessMessage('Task archived successfully. Undo?');
			setShowSuccessNotification(true);

			// Set up undo functionality
			enableUndo(task);

			// Update local tasks state or refetch from backend
			fetchTasks(); // Assuming this updates your local state reflecting the archive
		} catch (error) {
			console.error('Error archiving task:', error.message);
		}
	};

	const enableUndo = (task) => {
		// Set a timeout to disable undo after 7 seconds
		const undoTimeout = setTimeout(() => {
			setShowSuccessNotification(false);
		}, 7000);

		// Save the timeout ID if we need to clear it on undo
		setCurrentUndoTimeout(undoTimeout);
		setCurrentTask(task); // Keep track of the task for undoing
	};

	console.log(`Current task: `, currentTask);
	const undoArchive = async () => {
		if (currentUndoTimeout) {
			clearTimeout(currentUndoTimeout);
		}
		try {
			const { data, error } = await supabase.from('task').update({ isCompleted: false, isArchived: false }).eq('taskid', currentTask.taskid);

			if (error) throw error;

			setSuccessMessage('Undo successful');
			setShowSuccessNotification(true);
			fetchTasks(); // Refresh the task list
		} catch (error) {
			console.error('Error undoing archive:', error.message);
		}
	};

	useEffect(() => {
		return () => {
			if (currentUndoTimeout) {
				clearTimeout(currentUndoTimeout);
			}
		};
	}, [currentUndoTimeout]);

	// console.log(fetchUserByAuthId('291924e5-0dbd-4ec7-9ce6-e5eb6317c1f0'));
	// SUPABASE VERSION

	const [userNames, setUserNames] = useState({}); // To store usernames

	useEffect(() => {
		const fetchAndSetUserNames = async () => {
			const names = {};

			for (const task of tasks) {
				if (task.assignedtoauthid && !names[task.assignedtoauthid]) {
					const user = await fetchUserByAuthId(task.assignedtoauthid);
					if (user) {
						names[task.assignedtoauthid] = `${user.firstname} ${user.surname}`;
					}
				}
			}

			setUserNames(names);
		};

		if (tasks.length > 0) {
			fetchAndSetUserNames();
		}
		console.log(tasks[1]);
	}, [tasks, fetchUserByAuthId]);

	const saveTask = async (taskData) => {
		console.log('Task to save:', taskData);
		// TODO The extra fields i have added are need to be here too
		const { title, description, deadline, assignedToPerson } = taskData;

		const organizationId = userRecord.organizationid;
		const createdByAuthId = userRecord.authid;

		try {
			const { data, error } = await supabase.from('task').insert([
				{
					taskname: title,
					description: description,
					deadline: deadline,
					organizationid: organizationId,
					assignedtoauthid: assignedToPerson,
					// assignedtoteamid: assignedToTeam,
					createdbyauthid: createdByAuthId,
				},
			]);

			if (error) throw error;

			console.log('Saved task:', data);
			setSuccessMessage('Task created successfully');
			setShowSuccessNotification(true);
			setTimeout(() => setShowSuccessNotification(false), 3000);

			fetchTasks();
		} catch (error) {
			// TODO This should be display to user on the screen not in console
			console.error('Error saving task:', error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<SideNavigationBar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>
			<div className={TasksPageCSS.container_tasks}>
				<h1 className={TasksPageCSS.tasks_heading}>Task Manager</h1>

				<div className={TasksPageCSS.tasks_crud_containter}>
					<CrudElement
						icon="post_add"
						color="green"
						onClick={openCreateModal}
					/>
					{/* <CrudElement
						icon="edit_note"
						color="orange"
					/> */}
					{/* <CrudElement
						icon="playlist_remove"
						color="red"
					/> */}
				</div>

				<div className={TasksPageCSS.tasks_grid}>
					{/* TODO i need to get the assigned to seperately, basically it will need to tranlate authid to a record in a database and from there i will be getting the name  */}
					{tasks
						.filter((task) => !task.isCompleted && !task.isArchived)
						.map((task) => (
							<TaskElement
								key={task.taskid}
								title={task.taskname}
								description={task.description}
								deadline={task.deadline}
								dateCreated={task.datecreated}
								assignedTo={userNames[task.assignedtoauthid] || 'Not assigned'}
								onEdit={() => editTask(task.taskid)}
								onArchive={() => archiveTask(task)}
								onComplete={() => archiveTask(task)}
								onView={() => openViewModal(task)}
							/>
						))}
				</div>
			</div>
			<div className={TasksPageCSS.archives_container}>
				<h2 className={TasksPageCSS.archives_heading}>Archives</h2>
				<table className={TasksPageCSS.archives_table}>
					<thead>
						<tr>
							<th>Title</th>
							<th>Description</th>
							<th>Completion Date</th>
							<th>Assigned To</th>
						</tr>
					</thead>
					<tbody>
						<ArchiveRow
							title={'Task Example'}
							description={'Description of the completed task.'}
							deadline={'06/03/2024'}
							assignedTo={'Karolo Zigolo'}
						/>
						<ArchiveRow
							title={'Task Example'}
							description={'Description of the completed task.'}
							deadline={'06/03/2024'}
							assignedTo={'Karolo Zigolo'}
						/>
						<ArchiveRow
							title={'Task Example'}
							description={'Description of the completed task.'}
							deadline={'06/03/2024'}
							assignedTo={'Karolo Zigolo'}
						/>
						<ArchiveRow
							title={'Task Example'}
							description={'Description of the completed task.'}
							deadline={'06/03/2024'}
							assignedTo={'Karolo Zigolo'}
						/>
						<ArchiveRow
							title={'Task Example'}
							description={'Description of the completed task.'}
							deadline={'06/03/2024'}
							assignedTo={'Karolo Zigolo'}
						/>
					</tbody>
				</table>
			</div>
			<TaskViewModal
				isOpen={isViewModalOpen}
				task={viewingTask}
				onClose={closeViewModal}
			/>

			<TaskCreationModal
				// TODO so tje infromation are needed to be passed here
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSave={saveTask}
				employees={employeesForTask}
				loading={loading} // Pass loading state to the modal
				setLoading={setLoading} // Pass setLoading function to the modal to control loading state from within
			/>

			<SuccessNotification
				message={successMessage}
				isVisible={showSuccessNotification}
				onClose={closeNotification}
				undo={undoArchive}
			/>
		</>
	);
};

export default TasksPage;

// ALL TODO
// TODO The date needs to be added automatically
// 	// TODO I will need to work somehow with assigning, maybe it will give the list as well from poeple to choose from like on supabase
// TODO make the archives toggle so it doesn't load the date when not needed
// TODO when delete is pressed it moves the task to the archives /
// Option 2 is to create an X on the task and once pressed it will be moved to the archives, it owrk based on the column completed
// TODO List all the queries that needs to be implemented through supabase
// Do the pagination for the tasks, maximum of 12 on each page

// TODO This section
// I will want te task creator have the same top for creating deleting etc.
// But for the task itself I will have it in form of cards
// The done Tasks will be in the list format or a table this should be exported via pdf so the button would be created

// TODO I need to create a big container, that will be adjusting itself based wether the sidebar is open is not

// TODO Create the prompt about sucessfull/unsucessfull Task generation
// TODO Task can be only deleted from the archives
// TODO Add functionlity that based on the date how close to deadline it is there will be a red circle printed on the card
