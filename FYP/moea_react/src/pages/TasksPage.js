// React
import React, { useState, useContext, useEffect } from 'react';

// Styles
import TasksPageCSS from '../components/application/tasksPageComponents/TasksPage.module.css';

// Data
import { UserDataContext } from '../context/UserDataContext';
import supabase from '../config/supabaseClient';

// Components
import SideNavigationBar from '../components/application/sideBarComponents/SideNaviagtionBar';
import TaskElement from '../components/application/tasksPageComponents/taskElement';
import CrudElement from '../components/application/tasksPageComponents/CrudElement';
import ArchiveRow from '../components/application/tasksPageComponents/ArchiveRow';
import SuccessNotification from '../components/application/tasksPageComponents/SuccessNotification';

// Modals
import TaskCreationModal from '../components/application/tasksPageComponents/TaskCreationModal';
import TaskViewModal from '../components/application/tasksPageComponents/TaskViewModal';
import TaskEditModal from '../components/application/tasksPageComponents/TaskEditModal';

// TODO
import HelpIcon from '../components/application/HelpIcon.js';
// TODO go through the records in a list so they are all visible and depends who you pick it will get his authid and this will be assigned to a created task
// BUG When page realods it waits longser for getting the assigned to as it is another call, to it should all be printed in teh same time \

// TODO I need to create a big container, that will be adjusting itself based wether the sidebar is open is not

// TODO Task can be only deleted from the archives
// BUG When the task is updated the colour is not changing and the assigned person is not changing too, whic means we need to re-render the entire tab?
//

// TODO infrom the user that the task was created or updated
// TODO Edit the button slightly
// FIXME some other stuff througout the code, it is commented

const TasksPage = () => {
	// DATA
	const { userRecord, tasks, fetchTasks, employeesForTask, fetchUserByAuthId } = useContext(UserDataContext);
	const [userNames, setUserNames] = useState({});
	const [archivedTasks, setArchivedTasks] = useState([]);
	const [editingTask, setEditingTask] = useState(null);
	const [viewingTask, setViewingTask] = useState(null);
	const [currentTask, setCurrentTask] = useState(null);
	const [loading, setLoading] = useState(false);

	// Modals and rendering states
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isArchivesOpen, setIsArchivesOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	const [showSuccessNotification, setShowSuccessNotification] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [currentUndoTimeout, setCurrentUndoTimeout] = useState(null);

	// MODALS
	const toggleArchives = async () => {
		setIsArchivesOpen(!isArchivesOpen);
		if (!isArchivesOpen && archivedTasks.length === 0) {
			// Load archived tasks only if the archive is being opened and tasks have not been loaded yet
			await fetchArchivedTasks();
		}
	};

	// EDIT TASK MODAL

	const openEditModal = (task) => {
		setEditingTask(task);
		setIsEditModalOpen(true);
	};

	const closeEditModal = () => {
		setIsEditModalOpen(false);
		setEditingTask(null);
	};

	// NOTIFICATION

	const closeNotification = () => {
		setShowSuccessNotification(false);
	};

	// CREATE TASK MODAL

	const openCreateModal = () => {
		setIsCreateModalOpen(true);
	};

	const closeCreateModal = () => {
		setIsCreateModalOpen(false);
	};

	// SIDEBAR

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	// VIEW TASK MODAL

	const openViewModal = (task) => {
		setViewingTask(task);
		setIsViewModalOpen(true);
	};

	const closeViewModal = () => {
		setIsViewModalOpen(false);
		setViewingTask(null);
	};

	// UNDO NOTIFICATION

	const enableUndo = (task) => {
		// Set a timeout to disable undo after 7 seconds
		const undoTimeout = setTimeout(() => {
			setShowSuccessNotification(false);
		}, 7000);

		setCurrentUndoTimeout(undoTimeout);
		setCurrentTask(task); // Keep track of the task for undoing
	};

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

	// UPDATE TASK

	const updateTask = async (taskData) => {
		setLoading(true);
		try {
			const { data, error } = await supabase
				.from('task')
				.update({
					taskname: taskData.title,
					description: taskData.description,
					deadline: taskData.deadline,
					assignedtoauthid: taskData.assignedToPerson,
				})
				.match({ taskid: taskData.taskId });

			if (error) throw error;

			setSuccessMessage('Task updated successfully');
			setShowSuccessNotification(true);
			setTimeout(() => setShowSuccessNotification(false), 3000);
			fetchTasks(); // Refresh the task list to show the updated data
		} catch (error) {
			console.error('Error updating task:', error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateTask = async (updatedTaskData) => {
		try {
			const { error } = await supabase.from('task').update(updatedTaskData).eq('taskid', editingTask.taskid);

			if (error) throw error;

			setSuccessMessage('Task updated successfully');
			setShowSuccessNotification(true);
			setTimeout(() => setShowSuccessNotification(false), 3000);
			fetchTasks();
			closeEditModal();
		} catch (error) {
			console.error('Error updating task:', error.message);
		}
	};

	const fetchArchivedTasks = async () => {
		try {
			const { data, error } = await supabase.from('task').select('*').eq('isArchived', true);
			if (error) throw error;
			setArchivedTasks(data);
		} catch (error) {
			console.error('Error fetching archived tasks:', error.message);
		}
	};

	const archiveTask = async (task) => {
		try {
			const { error } = await supabase.from('task').update({ isCompleted: true, isArchived: true }).eq('taskid', task.taskid);
			// console.log(`Archived Task:`, task.taskid);

			if (error) throw error;

			// UI Feedback
			setSuccessMessage('Task archived successfully. Undo?');
			setShowSuccessNotification(true);
			enableUndo(task);
			fetchTasks();
		} catch (error) {
			console.error('Error archiving task:', error.message);
		}
	};

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
		// console.log(tasks[1]);
	}, [tasks, fetchUserByAuthId]);

	const saveTask = async (taskData) => {
		// console.log('Task to save:', taskData);
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
					// assignedtoteamid: assignedToTeam, TODO
					createdbyauthid: createdByAuthId,
				},
			]);
			if (error) throw error;
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
	const jobRole = userRecord.jobroleid;

	const getHelpContentBasedOnRole = (jobRole) => {
		switch (jobRole) {
			case 1: // Chief
				return 'As a Chief, you have complete control over the Tasks Page. You can create, view, edit, complete, and archive tasks. This access allows you to manage tasks across the entire organization, ensuring everything is on track and up-to-date.';

			case 2: // Manager
				return "As a Manager, you have the ability to create new tasks, view all tasks, edit them, and move them to archive. This role enables you to manage tasks within your department, ensuring that your team's objectives are clearly defined and monitored.";

			case 3: // Secretary
				return 'As a Secretary, your access includes the creation of new tasks and the ability to view and archive existing tasks. This role allows you to support the management team by organizing and updating tasks as needed, ensuring operational efficiency.';

			case 4: // Team Leader
				return 'As a Team Leader, you are permitted to view tasks specifically assigned to your team. This focused access helps you manage and monitor the progress of tasks within your direct responsibility, aiding in the efficient management of your team’s workload.';

			case 5: // Employee
				return 'As an Employee, you can view tasks that are directly assigned to you. This allows you to keep track of your individual responsibilities and deadlines, ensuring you stay informed about your specific contributions to team goals.';

			default:
				return 'Access to this page is restricted based on your user role. If you believe you are seeing this message in error, please contact your system administrator.';
		}
	};

	const helpContent = getHelpContentBasedOnRole(jobRole);

	return (
		<>
			<SideNavigationBar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>
			<HelpIcon helpContent={helpContent} />
			<div className={TasksPageCSS.container_tasks}>
				<h1 className={TasksPageCSS.tasks_heading}>Task Manager</h1>

				<div className={TasksPageCSS.tasks_crud_containter}>
					<CrudElement
						icon="post_add"
						color="green"
						onClick={openCreateModal}
					/>
				</div>
				<div className={TasksPageCSS.tasks_grid}>
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
								onEdit={() => openEditModal(task)}
								onArchive={() => archiveTask(task)}
								onComplete={() => archiveTask(task)}
								onView={() => openViewModal(task)}
							/>
						))}
				</div>
				<button
					className={TasksPageCSS.show_archive}
					onClick={toggleArchives}>
					{isArchivesOpen ? 'Hide Archives' : 'Show Archives'}
				</button>
				{isArchivesOpen && (
					<div className={TasksPageCSS.archives_container}>
						<h2 className={TasksPageCSS.archives_heading}>Archives</h2>
						<table className={TasksPageCSS.archives_table}>
							<thead>
								<tr>
									<th>Title</th>
									<th>Description</th>
									<th>Deadline</th>
									<th>Assigned To</th>
									<th>TaskID</th>
								</tr>
							</thead>
							<tbody>
								{archivedTasks.map((task) => (
									<ArchiveRow
										key={task.taskid}
										title={task.taskname}
										description={task.description}
										deadline={task.deadline}
										taskid={task.taskid}
										assignedTo={userNames[task.assignedtoauthid] || 'Not assigned'}
									/>
								))}
							</tbody>
						</table>
					</div>
				)}
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
				loading={loading}
				setLoading={setLoading}
			/>
			<TaskEditModal
				isOpen={isEditModalOpen}
				onClose={closeEditModal}
				onSave={handleUpdateTask}
				task={editingTask}
				employees={employeesForTask}
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
