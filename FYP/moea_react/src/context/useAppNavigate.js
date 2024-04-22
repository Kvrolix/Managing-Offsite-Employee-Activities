import { useNavigate } from 'react-router-dom';

export const useAppNavigate = () => {
	const navigate = useNavigate();

	const navigateToDashboard = () => navigate('/dashboard');
	const navigateToTasks = () => navigate('/tasks');
	const navigateToOrganization = () => navigate('/organization');
	// Add more navigation functions as needed

	const navigateToTeams = () => {};
	const navigateToChat = () => {};
	const navigateToFiles = () => {};
	const navigateToUsers = () => {};
	// const navigateToOrganization = () => {};

	return { navigateToDashboard, navigateToTasks, navigateToOrganization };
};
