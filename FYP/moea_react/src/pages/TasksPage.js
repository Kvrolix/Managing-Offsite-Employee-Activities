// React
import React, { useState } from 'react';

// Styles
import TasksPageCSS from '../components/application/tasksPageComponents/TasksPage.module.css';

// Data
import { UserDataProvider } from '../context/UserDataContext';

// Components
import SideNavigationBar from '../components/application/SideNaviagtionBar';
import TaskElement from '../components/application/tasksPageComponents/taskElement';
import CrudElement from '../components/application/tasksPageComponents/CrudElement';
import ArchiveRow from '../components/application/tasksPageComponents/ArchiveRow';
import SuccessNotification from '../components/application/tasksPageComponents/SuccessNotification';
import TaskCreationModal from '../components/application/tasksPageComponents/TaskCreationModal';

// ALL TODO
// TODO The date needs to be added automatically
// 	// TODO I will need to work somehow with assigning, maybe it will give the list as well from poeple to choose from like on supabase
// TODO make the archives toggle so it doesn't load the date when not needed
// TODO when delete is pressed it moves the task to the archives /
// Option 2 is to create an X on the task and once pressed it will be moved to the archives, it owrk based on the column completed
// TODO List all the queries that needs to be implemented through supabase
// Do the pagination for the tasks, maximum of 12 on each page

const TasksPage = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};
	// TODO This section
	// I will want te task creator have the same top for creating deleting etc.
	// But for the task itself I will have it in form of cards
	// The done Tasks will be in the list format or a table this should be exported via pdf so the button would be created

	// TODO I need to create a big container, that will be adjusting itself based wether the sidebar is open is not

	// TODO Create the prompt about sucessfull/unsucessfull Task generation
	// TODO Task can be only deleted from the archives
	// TODO Add functionlity that based on the date how close to deadline it is there will be a red circle printed on the card
	const [isModalOpen, setIsModalOpen] = useState(false);
	// Function to handle opening the modal
	const openModal = () => setIsModalOpen(true);
	// Function to handle closing the modal
	const closeModal = () => setIsModalOpen(false);
	const [showSuccessNotification, setShowSuccessNotification] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	// Placeholder function for saving the task
	// Modify the saveTask function to show the notification
	const saveTask = (taskData) => {
		console.log('Task to save:', taskData);
		// Simulate saving task...
		setSuccessMessage('Task created successfully');
		setShowSuccessNotification(true);
		setTimeout(() => setShowSuccessNotification(false), 3000); // Auto-hide after 3 seconds
	};
	const closeNotification = () => {
		setShowSuccessNotification(false);
	};
	return (
		<>
			<UserDataProvider>
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
						<TaskElement
							title="Task Example"
							description="Description of the completed task."
							deadline="06/03/2024"
							assignedTo="Karolo Zigolo"
						/>
						<TaskElement
							title="Task Example"
							description="Description of the completed task."
							deadline="06/03/2024"
							assignedTo="Karolo Zigolo"
						/>
						<TaskElement
							title="Task Example"
							description="Description of the completed task."
							deadline="06/03/2024"
							assignedTo="Karolo Zigolo"
						/>
						<TaskElement
							title="Task Example"
							description="Description of the completed task."
							deadline="06/03/2024"
							assignedTo="Karolo Zigolo"
						/>
						<TaskElement
							title="Task Example"
							description="Description of the completed task."
							deadline="06/03/2024"
							assignedTo="Karolo Zigolo"
						/>
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
			</UserDataProvider>
			<TaskCreationModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={saveTask}
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
