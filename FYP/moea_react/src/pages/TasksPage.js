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
import TaskCreationModal from '../components/application/tasksPageComponents/TaskCreationModal';

// TODO go through the records in a list so they are all visible and depends who you pick it will get his authid and this will be assigned to a created task

const TasksPage = () => {
	// DATA
	const { userRecord, tasks, fetchTasks, employeesForTask } = useContext(UserDataContext);

	// Modals and rendering states
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showSuccessNotification, setShowSuccessNotification] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [loading, setLoading] = useState(false);

	// Modal functions
	const closeModal = () => setIsModalOpen(false);
	const openModal = () => setIsModalOpen(true);
	const closeNotification = () => {
		setShowSuccessNotification(false);
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	// Old version
	// const saveTask = (taskData) => {
	// 	console.log('Task to save:', taskData);
	// 	// Simulate saving task...
	// 	setSuccessMessage('Task created successfully');
	// 	setShowSuccessNotification(true);
	// 	setTimeout(() => setShowSuccessNotification(false), 3000);
	// };
	// useEffect(() => {
	// 	console.log('Tasks:', tasks);
	// }, [tasks]);
	// useEffect(() => {
	// 	console.log('People:', employeesForTask);
	// }, [employeesForTask]);

	// useEffect(() => {
	// 	console.log('User:', userRecord);
	// }, [userRecord]);

	// SUPABASE VERSION

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

			// Optionally, re-fetch tasks to update the list
			// fetchTasks();
			fetchTasks();
		} catch (error) {
			console.error('Error saving task:', error.message);
			// Handle error, such as showing an error message to the user
		} finally {
			setLoading(false); // Stop loading after task is saved or if there's an error
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
						onClick={openModal}
					/>
					<CrudElement
						icon="edit_note"
						color="orange"
					/>
					<CrudElement
						icon="playlist_remove"
						color="red"
					/>
				</div>

				<div className={TasksPageCSS.tasks_grid}>
					{tasks.map((task) => (
						<TaskElement
							key={task.taskid}
							title={task.taskname}
							description={task.description}
							deadline={task.deadline}
							assignedTo={task.assignedtouserid} // You will need to fetch the user's name separately
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

			<TaskCreationModal
				// TODO so tje infromation are needed to be passed here
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={saveTask}
				employees={employeesForTask}
				loading={loading} // Pass loading state to the modal
				setLoading={setLoading} // Pass setLoading function to the modal to control loading state from within
			/>
			<SuccessNotification
				message={successMessage}
				isVisible={showSuccessNotification}
				onClose={closeNotification}
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
